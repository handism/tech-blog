---
title: Pythonに入門する
tags: [Python]
image: python-character.webp
---


## Pythonの基礎知識

### モジュールのインストール

```zsh
pip install ~~
```

### Pythonの実行

拡張子を「xxx.py」にして保存し、コンソールから「`python3 xxx.py`」で実行


### .pyを定期実行する
Mac：Automator＞アプリケーション＞シェルスクリプトを実行　でできる
Win：タスクスケジューラ＞基本タスクの作成


### 関数作成

```py
def open_finder():
~~
~~
~~
```


## Webスクレイピング

### ブラウザ操作
* `Selenium`をインストールする
  * Webのテストに適している
  * テキスト入力やボタンのクリックなどができる
  * ブラウザを直接操作する
* `beautiful soup`はデータ抽出に優れる
  * `html.parsar`で要素を取得できる
  * ブラウザは不要

### スクレイピング結果をcsvに出力する
`pandas`をインストールする

```py
pd.DaraFrame()
pd.to_csv('ファイル名.csv')
```


## OCRの実装
モジュールのインストール
* `tesseract-ocr`
* `pyocr`


## Pythonの文法など

### 算術演算子

* 1 + 1 # 加算
* 1 - 1 # 減算
* 1 * 1 # 乗算
* 1 / 1 # 割算
* 1 // 1 # 商
* 1 % 1 # あまり
* 1 ** 1 # べき乗

### 標準体重算出

```py
height = float(input("身長(cm)を入力してください"))
bmi = 22
std_weight = bmi * (height / 100) **2
print("標準体重: " + str(std_weight) + "kg")
```

### 型を返す

```py
type()
```

### リスト型（値を変えられる）

```py
height = [180, 165, 159, 171, 155]
print(height[0])
print(height[-5])
len(height)
height[len(height)-1] # リストの最後の要素
```

### タプル型（値を変えられない）

```py
height = (180, 165, 159, 171, 155)
height[0]
```

### 相互変換

```py
list()
list(range(0, 101, 10)) # [0, 10, 20 … 90, 100]
tuple()
```

### 文字列もシーケンス型

```py
s = "こんにちは"
s[1]
```

### オブジェクトのidを調べる

```py
id(obj)
```

### モジュールのインポート

```py
import calendar
from calendar import TextCalendar
```


### カレンダー表示

```py
cal = calendar.TextCalendar(6) # 日曜日から始める
cal.prmonth(2016, 1)
```


### mathモジュール

```py
import math
num = math.sqrt(16) # 平方根
math.cell(16) # 引数以上の最小の整数
math.floor(16) # 引数以上の最大の整数
math.exp(16) # eの引数乗
math.log(16) # 自然対数
math.pow(x, y) # xのy乗
math.sin(x)
math.cos(x)
math.tan(x)
math.radian(x)
math.pi
math.e # 自然対数の底
```


### 乱数

```py
import random
random.randint(0, 3)
random.randrange(3)
```


### おみくじ

```py
import random
kuji = ["大吉", "中吉", "凶"]
print(kuji[random.randrange(len(kuji))])
```

### 比較

```py
(10, 2) > (9, 4)
true
```

### if ※switchはない

```py
if score >= 80:
print("合格です")
else:
print("不合格です")
elif aa < 2:
not
and
or
```


### うるう年判定

```py
year = int(input("年の値を入力してください："))
if((year % 4 == 0) and (year % 100 != 0)) or (year % 400 == 0):
print(str(year) + "年は閏年です")
else:
print(str(year) + "年は閏年じゃない")
```


### リスト、タプル、文字列の要素かどうか

```py
3 in [1, 2, 3]
true
not in
```

### ループ

```py
for 変数 in イテレート可能なobj:
iter(obj)
next(イテレータ)
for i in range(10):
for i in range(3, 31, 3): # 3から30まで3つとび
while counter <= end:
break
continue

for index, country in enumerate(countries): # インデックスと要素をペアにして取り出せる

for (eng, jap) in zip(weekday1, weekday2): # 二つ以上のリストの要素を順にペアにして取り出せる
```

forのあとにelse:も使える。


### 例外処理

```py
try:
except 例外:
else:
```


### 文字列

```py
str.upper()
str.count(文字列, [,開始] [,終了])
str.endswith()
str.find()
str.join()
str.lower()
str.replace()
str.split()
str.startswith()
s[1:5]
s[:3]
"こんにちは{}の世界へ".format("python")
"{:.3f}".format(10 / 2.54)
"{:,}".format(111111111) # カンマ区切り
```


### リスト

```py
lst = ["春", "夏"] + ["秋"] +
["冬"]
lst = ["春"] * 4
lst[2:5]
lst[::2] # 偶数番目
str = "A,B,C,D"
lst = str.split(",") # ['A', 'B', 'C', 'D']となる
index('A')
append()
remove()
del str[1]
reverse()
max()
min()
sum()
sort(reverse=True)
sorted(lst)
```


### 引数を受け取る（ただし、argvは文字列）

```py
import sys
sys.argv
```


### Dictionary（マッピング型）

```py
colors = {"red":"赤",
"blue":"青"}
len()
colors["red"]
colors["green"] = "緑"
del colors["blue"]
keys() # 戻り値は「ビュー」
values() # 戻り値は「ビュー」
items()
```


### set（集合）（重複を許さない）

```py
signal = {"赤", "青", "黄"}
set()
add()
remove()
clean()
set1 | set2 # 和集合
set1 & set2 # 共通する要素
set1 - set2 # set1に含まれ、set2に含まれないもの
set1 ^ set2 # どちらか一方のみに含まれるもの
```


### 内包表記（高速に動作する）

```py
[式 for 変数 in イテレータ]
lst = [num ** 2 for num in range(0, 21, 2)]
{キー:値 for 変数 in イテレータ}
{式 for 変数 in イテレータ}
```


### 関数定義

```py
def doll_to_yen(doll, rate=100): # デフォルト値も設定可能
return
yen = doll_to_yen(doll=100, rate=105)
def func(arg1, *arg2): # 可変長引数。2番目以降はタプルとして受け取れる。
def func(**dic): # 辞書も受け取れる。
map(関数名, lst)
filter(関数名, lst)
```


### ファイル操作

```py
open()
read()
readline()
close()
rstrip()
write()
writelines()
with open() as ファイル: # withが終わったらcloseしてくれる
os.path.exists()
```


### クラス定義

```py
class クラス名:
def **init**(self, …)
pass
__変数 # カプセル化
property()

class サブクラス名(スーパークラス名): # 継承

super()
```