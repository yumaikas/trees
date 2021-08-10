(use praxis)
(import praxis/sqlite :as db)
(import sqlite3 :as sql)
(import json)

(s/defschema 
  Documents
  (s/field :rowid :integer :hidden true)
  (s/field :name :string :string)
  (s/field :contents :text))

(defn create [file] 
  (db/tx
    file
    (db/init [Documents]))
  (print "created database!"))

(defn list-documents [file] 
  (db/tx
    file
    (db/eval "Select rowid as id, name from Documents")))

(defn create-document [file name contents] 
  (db/tx
    file
    (db/eval 
      "Insert into Documents(name, contents) 
      values (:name, :contents)"
      {:name name :contents contents})
    (def id (sql/last-insert-rowid (dyn :praxis/db)))
    (def body (json/decode contents))
    (put body "message" nil)
    (put body "document_url_id" id)
    (db/eval
      "Update Documents
      set contents = :contents
      where rowid = :id"
      {:id id :contents (json/encode body)}
    )
    id))


(defn update-document [file id contents]
  (db/tx
    file
    (put contents "message" nil)
    (db/eval 
      "Update Documents
      set contents = :contents
      where rowid = :id
      "
      {:id id :contents (json/encode contents)})
    (sql/last-insert-rowid (dyn :praxis/db))))

(defn get-document [file id] 
  (db/tx
    file
    (def [record] (db/eval 
      "Select rowid as id, name, contents 
       from Documents
       where rowid = :id 
             " 
             {:id id}))
    (as-> (json/decode (record :contents)) d
          (put d "message" nil)
          d) )
  )


