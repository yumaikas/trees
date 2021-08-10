(use osprey)
(import janet-html :as html)
(import json)
(import ./db)


(defn s. [& args] (string ;args))

(defn html-of [body] 
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body body})

(defn json-of [data] 
  {:status 200
   :headers {"Content-Type" "text/json"}
   :body (json/encode data)})

(defn redirect [url] 
  {:status 302
   :headers {"Location" url}})

(defn text-of [body] 
  {:status 200
   :headers {"Content-Type" "text/plain"}
   :body body})

(defn get-kv [args key]
  (get args (+ 1 (or (index-of key args) -1))))

(defn layout [body] 
  (html/encode 
    (html/doctype :html5)
    [:html {:lang "en"}
     [:head
      [:meta :charset "utf-8"]
      [:meta 
       :name "viewport" 
       :content "width=device-width, initial-scale=1.0" ]
      [:link {:rel "stylesheet" :href "/base.css" }] ]
     [:body body]]))

(defn v/home [] 
  (layout
    [:div {:id "app"}
     [:script {:type "text/javascript" :src "/index.js"}] ]
    ))


# eye trees.janet public project.janet --cmd janet.exe trees.janet
(defn main [& args]
  (enable :static-files)
  (def db-file (or 
                 (get-kv args "--dbfile") 
                 (os/getenv "DBFILE") 
                 (error "Please use --dbfile or DBFILE env var to specify the sqlite db file!")))
  (db/create db-file)

  (GET "/" 
       (html-of (v/home)))

  (GET "/documents" 
       (json-of (db/list-documents db-file)))

  (POST "/documents" 
        (def {"name" name "outline" contents} (json/decode (request :body)))
        (text-of (string (db/create-document 
          db-file 
          name
          (json/encode contents)))))
  (GET "/documents/:id"
       (def id (scan-number (params :id)))
       (json-of (db/get-document db-file id)))

  (POST "/documents/:id"
        (def id (scan-number (params :id)))
        (def body (json/decode (request :body)))
        (db/update-document db-file id body)
        (text-of "Saved!"))

  (os/shell "start http://localhost:9005/")
  (server 9005) 
  )
