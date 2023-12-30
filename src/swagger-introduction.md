---
title: Swagger Editorを試してみる
tags: [swagger, backend]
---

## 経緯
今まではAPIを送信する機能をゴリゴリにプログラミングしていたが、いとも簡単にAPIを生成できるSwagger（OpenAPI）なる仕組みがあると知って驚愕した。  

実際に使用してみて便利さを確かめてみる。


## Swagger Editorをいじる
まずはお手軽にブラウザで扱える`Swagger Editor`を試す。  
  
以下にアクセス。  
https://editor-next.swagger.io  
  
左側のカラムがYAMLになっていて、右側にその内容がリアルタイムにドキュメント化されているっぽい。  
  
YAMLの方にはサンプルコードが記載されているが、802行もあって何がなんだかわかりにくい…  
  
https://swagger.io/docs/specification/basic-structure/  
↑こちらに最小構成があった。  
  
今回作成することになる`OpenAPI定義`はYAMLまたはJSON形式で書けるので、馴染みのあるYAMLを選択。
サンプルがこちら。

```yml
openapi: 3.0.0
info:
  title: Sample API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9

servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
  - url: http://staging-api.example.com
    description: Optional server description, e.g. Internal staging server for testing

paths:
  /users:
    get:
      summary: Returns a list of users.
      description: Optional extended description in CommonMark or HTML.
      responses:
        '200':    # status code
          description: A JSON array of user names
          content:
            application/json:
              schema: 
                type: array
                items: 
                  type: string
```

必須なのは以下の3点。
* `openapi`：バージョン
* `info`：API情報
* `paths`：APIの個々のエンドポイントとHTTPメソッド

必須でないものについては以下。
* `servers`：APIサーバーとベースURL
* `externalDocs`：外部のドキュメントを参照する場合
* `tags`：APIをタグごとに分けて表示できるっぽい


## YAMLファイルを保存する
`File > Save as YAML`

## サーバを生成する
Spring Bootで起動したかったので、`Generate Server > Spring`を選択。  
Zipファイルで生成される。  
`src/main/java/io/swagger/api`内にjavaファイルが6ファイル生成された。
既存のSpring Bootプロジェクトに入れてビルドしたら色々不足していてエラーでこけた。  
  
次は、元々`npm`がインストール済みなので`Generate Client > nodejs-server`を選択。  
できたzipを展開して`cd`して`npm start`してhttp://localhost:8080/docs/ にアクセスできればOK。  
ローカルのモックAPIサーバーがすごく簡単に構築できた。


## クライアントを生成する
`Generate Client > html2`でいい感じのドキュメントが生成されて便利。  
単一HTMLファイルが生成されるので扱いも楽ちん。  
  
APIを送るのは`Postman`が扱いやすくて良い。  
`curl`でも良いし、Vue.jsに`axios`を組み込んでも良いし。


## サンプル
```yml
openapi: 3.0.0
info:
  title: Your API
  version: 1.0.0
  description: Description of your API

servers:
  - url: http://localhost:3000
    description: Development Server

paths:
  /example:
    get:
      summary: Get example data
      description: Retrieve example data from the server
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              example:
                message: 'Success!'
        '404':
          description: Resource not found
          content:
            application/json:
              example:
                message: 'Not Found'

components:
  schemas:
    ExampleResponse:
      type: object
      properties:
        message:
          type: string
      example:
        message: 'Example response message'
```