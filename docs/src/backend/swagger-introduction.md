---
title: Swagger Editorを試してみる
description: Swagger Editorを試してみる
---

[[TOC]]

## 経緯
今まではAPIを送信する機能をゴリゴリにプログラミングしていたが、いとも簡単にAPIを生成できるSwagger（OpenAPI）なる仕組みがあると知って驚愕した。  

実際に使用してみて便利さを確かめてみる。


## Swagger Editorをいじる
まずはお手軽にブラウザで扱える`Swagger Editor`を試す。  
  
以下にアクセス。 
https://editor.swagger.io  
  
左側のカラムがYAMLになっていて、右側にその内容がリアルタイムにドキュメント化されているっぽい。  
  
YAMLの方にはサンプルコードが記載されているが、802行もあって何がなんだかわかりにくい…

https://swagger.io/docs/specification/basic-structure/
↑こちらに最小構成があった。

YAMLまたはJSONなのでYAMLを選択。
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

* openapi：バージョン
* info：API情報
* servers：APIサーバーとベースURL
* paths：APIの個々のエンドポイントとHTTPメソッド


## YAMLファイルを保存する
`File > Save as YAML`

## サーバを生成する
`Generate Server > Spring`

Zipファイルで生成される。
`src/main/java/io/swagger/api`内にjavaファイルが6ファイル生成された。
既存のSpring Bootプロジェクトに入れてビルドしたら色々不足していてエラーでこけた。


## クライアントを生成する
`Generate Client > html2`

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