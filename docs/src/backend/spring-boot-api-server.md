---
title: Spring BootでDocker上にAPIサーバーを構築する
description: Spring BootでDocker上にAPIサーバーを構築する
---

[TOC]

## やりたいこと
ダミーでAPIを送信するサーバーが必要になったので、導入が楽でサクッとできるという噂のSpring BootでAPIサーバーを構築してみる。  
わざわざレンタルサーバーやVPCなどを借りるのもアレなので、Dockerも導入してローカルで起動できるようにする。


## Dockerの導入
まずはDockerの導入から。  
と言っても、個人利用であれば「Docker Desktop」をインストールするだけでOK。簡単。  
https://www.docker.com/products/docker-desktop/  
  
インストールが終わったら、ダブルクリックで起動する。


## Spring Bootの導入
https://spring.pleiades.io/spring-boot/docs/current/reference/html/getting-started.html  
↑の公式サイトを参考に、Spring Bootを導入する。  

### Spring Initializrでプロジェクトを作成
まず最初は、「spring initializr」というスターターでプロジェクトを作成する。  
https://start.spring.io  
  
設定は以下としてみた。  
* Project：Gradle - Kotlin
* Language：Java
* Spring Boot：3.2.0
* Project Metadata：初期状態のまま
* Dependencies
 * Lombok
 * Docker Compose Support
 * Spring Web
 * Thymeleaf
 * Spring Boot DevTools

設定を入力して「GENERATE」ボタンを押すとzipファイルがダウンロードされるので解凍すればそのままプロジェクトとして使える。  

src/mainがアプリのメインで、src/testの方はテストコード？  
src/resources/staticにはおそらくcss,js,font,img,htmlなどを入れるっぽい。


### Javaの導入
Javaを入れていない場合は導入する。  
スターターでJava17を選んだので、Java SE Development Kit 17.0.9をダウンロードする。  
https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html  

「macOS Arm 64 Compressed Archive」をダウンロードしてインストール。  
`java -version`でバージョンが表示されれば成功。


### プロジェクトのビルド
早速プロジェクトをビルドして、Dockerイメージを作成してみる。  
ビルドには`gradle`を利用する。  
ターミナルで以下のコマンドを叩くだけ。  
  
```zsh
./gradlew bootBuildImage
```
  
初回のみ必要なものが自動でダウンロードされ、JavaがビルドされてDockerイメージが作成される。  
初期設定であればイメージ名は`docker.io/library/demo:0.0.1-SNAPSHOT`。  


### プロジェクトの実行
プロジェクトを実行したい場合は、ターミナルで以下を叩く。  

```zsh
./gradlew bootRun
```
  
以下のエラーが出たため修正する。  
  
```zsh
Stderr:
validating /Users/mac/git/backend-api-server/compose.yaml: services must be a mapping
```
  
どうやら、Docker Compose用の`compose.yaml`ファイルの中身が空っぽのためエラーとなっている様子。  
中身を以下に修正。  

```





### Dockerイメージのrun
イメージが無事に作成されたら、`Docker Desktop`を起動。  
  
左のメニューのImagesから`demo`を選んでrunすればアプリケーションがローカル上で起動される。  
すごく簡単にJavaアプリケーションが作成できた。  
