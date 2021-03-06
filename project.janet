(declare-project 
      :name "trees"
      :description "A smol web server program for editing outlines with a smol command line"
      :author "Andrew Owen <yumaikas94@gmail.com>"
      :url "https://github.com/yumaikas/trees"
      :dependencies 
      [ "https://github.com/swlkr/osprey"
        "https://github.com/swlkr/janet-html"
        "https://github.com/yumaikas/praxis"
        "json" ])

(phony
  "bundle" [] 
  (os/cd "js")
  (os/shell "esbuild index.jsx --bundle --outfile=../public/index.js --jsx-factory=h --sourcemap --define:process.env.NODE_ENV='development'")
  )

(phony 
  "bundle:watch" []
  (os/cd "js")
  (os/shell "esbuild index.jsx --bundle --outfile=../public/index.js --watch --jsx-factory=h --sourcemap --define:process.env.NODE_ENV='development'")
       )
