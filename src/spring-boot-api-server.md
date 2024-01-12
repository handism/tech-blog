---
title: Spring BootでDocker上にAPIサーバーを構築する
date: 2023-12-03
tags: [Backend, Spring Boot, Kotlin]
image: spring-boot-image.webp
---

## やりたいこと
ダミーでAPIを送信するサーバーが必要になったので、導入が楽でサクッとできるという噂のSpring BootでAPIサーバーを構築してみる。

わざわざレンタルサーバーやVPCなどを借りるのもアレなので、Dockerも導入してローカルで起動できるようにする。


## Spring Bootとは？
まず、JavaをわかりやすくしたのがSpring Frameworkというフレームワークで、Spring Bootはそれを更に扱いやすくしたもの。特にXMLの設定が簡略化されている。

アノテーション機能を使ってコード量を少なく記載が可能。

* `@Controller`：コントローラとして動作
* `@RequestMapping(“/xxx”)`：リクエストを受けるメソッドを指定
* `@ModelAttribute`：リクエストパラメータの割り当て
* `@Getter`：ゲッターを自動生成
* `@Setter`：セッターを自動生成

また、導入が簡単でセキュリティや入力値のチェックも簡単に書けるので開発・保守の効率がアップしている。デザインパターンはMVCモデルが採用されている。

* Model（Java）：DBとやりとり
* View（HTML）：画面表示
* Controller（Java）：リクエストを受けてモデルとビューを呼び出す


## Dockerの導入
まずはDockerの導入から。と言っても、個人利用であれば「Docker Desktop」をインストールするだけでOK。簡単。

https://www.docker.com/products/docker-desktop/

インストールが終わったら、ダブルクリックで起動する。


## Spring Bootの導入
https://spring.pleiades.io/spring-boot/docs/current/reference/html/getting-started.html  
↑の公式サイトを参考に、Spring Bootを導入する。

### Spring Initializrでプロジェクトを作成
まず最初は、「`spring initializr`」というスターターでプロジェクトを作成する。  
https://start.spring.io

設定は以下としてみた。

* Project：Gradle - Kotlin
* Language：Java
* Spring Boot：3.2.0
* Project Metadata：初期状態のまま
* Dependencies
    * Spring Web

設定を入力して「GENERATE」ボタンを押すとzipファイルがダウンロードされるので解凍すればそのままプロジェクトとして使える。

`src/main`がアプリのメインで、`src/test`の方はテストコード？`src/resources/static`にはおそらく`css`,`js`,`font`,`img`,`html`などを入れるっぽい。


### Javaの導入
Javaを入れていない場合は導入する。

スターターで`Java17`を選んだので、`Java SE Development Kit 17.0.9`をダウンロードする。  
https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html  

「`macOS Arm 64 Compressed Archive`」をダウンロードしてインストール。`java -version`でバージョンが表示されれば成功。


## APIサーバー構築
開発の準備が整ったので、APIサーバーを構築すべく、実際にコーディングを実施していく。


### 開発環境について
Spring BootのIDE（統合開発環境）については、「`IntelliJ IDEA`」を使うのが楽。

ただ、Vue.jsなどのフロントエンドの技術も扱うので切り替えが面倒なため、「`VSCode`」で開発を行っている。
  
VSCode用の拡張機能としては「`Spring Boot Dashboard`」あたりを入れておけばGUIでビルドができたり、自動でクラスの分類を「APPS/BEANS/ENDPOINT MAPPINGS」に分けてくれたりと何かと便利。


### ダミーのAPIを送信するクラスを作成
`src/main/java/com/example/demo`フォルダ内に、「DummyController.java」というファイルを作成し、中身は以下のようにしてみた。

```java
package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
public class DummyController {

    @GetMapping("/dummy-get")
    public String handleDummyGet() {
        // ダミーのGETリクエストを処理するロジック
        String response = "This is a dummy GET response";
        System.out.println("GET Request: " + response);
        return response;
    }

    @PostMapping("/dummy-post")
    public String handleDummyPost(@RequestBody String requestBody) {
        // ダミーのPOSTリクエストを処理するロジック
        String response = "This is a dummy POST response";
        System.out.println("POST Request Body: " + requestBody);
        System.out.println("POST Response: " + response);
        return response;
    }
}
```


### プロジェクトの動作確認
ローカル上でプロジェクトを実行したい場合は、ターミナルで以下を叩く。

```zsh
./gradlew bootRun
```

初回実行の場合は、必要なものが自動でインストールされる。エラーがなければローカル上でTomcatが立ち上がり、http://localhost:8080/ でアプリを起動可能。
  
上のクラスファイルの例では、http://localhost:8080/dummy-get のようなURLをCurlで叩くなりブラウザでアクセスするなりで動作確認が可能。

実際にブラウザでアクセスしてみると、ブラウザ上に以下の文言が表示されたのでうまく動いているようだ。

```
This is a dummy GET response
```

::: tip
ちなみに、実行をやめたい場合は`Ctrl + C`。
:::


### プロジェクトのビルド
開発が完了し、リリースを行う際はDockerのイメージとしてビルドするのが昨今の流行りとなっている。プロジェクトをビルドして、Dockerイメージを作成してみる。

ビルドには`gradle`を利用する。ターミナルで以下のコマンドを叩くだけ。

```zsh
./gradlew bootBuildImage
```
  
初回のみ必要なものが自動でダウンロードされ、JavaがビルドされてDockerイメージが作成される。初期設定であればイメージ名は`docker.io/library/demo:0.0.1-SNAPSHOT`。


### Dockerイメージのrun
イメージが無事に作成されたら、`Docker Desktop`を起動。

デスクトップアプリケーションでも左のメニューのImagesから`demo`を選んでrunすればアプリケーションがローカル上で起動されるが、ターミナルからでもrunできる。例えば以下のようなコマンドを叩く。

```zsh
docker run -d -p 1234:8080 demo:0.0.1-SNAPSHOT
```

この例であれば、http://localhost:1234/dummy-get みたいな感じでAPIを叩くことが可能。

すごく簡単にJavaアプリケーションが作成できた。