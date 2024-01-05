/**
 * @file [tag].paths.mjs
 * @description フォルダ内のMarkdownファイルをすべて読み込み、Frontmatterのtags:からタグ一覧を返却する
 */

import fg from 'fast-glob'
import matter from 'gray-matter'

const folderPath = 'src/*.md' // Markdownファイルのあるフォルダのパスを指定
const tagSet = new Set() // タグを格納するためのセット
const files = fg.sync([folderPath, '!**/node_modules'])

files.forEach((file) => {
  // Markdownファイル内のFrontmatterを取得
  const { data } = matter.read(file)

  // tags:がある場合は配列からセットに格納していく（URLに利用されるため小文字＆ハイフンつなぎに変換）
  if (data && data.tags && Array.isArray(data.tags)) {
    data.tags.forEach((tag) => tagSet.add(tag.toLowerCase().replace(" ", "-")))
  }
})

// 重複をなくしたタグの一覧を配列に変換
const tagList = Array.from(tagSet)
// VitePressのパラメータ用にオブジェクト形式に変換
const paramsArray = tagList.map((tag) => ({ params: { tag } }))

/**
 * タグ一覧を返却
 * @param なし
 * @returns {any[]} タグ一覧
 */
export default {
  tagList() {return tagList},
  paths() {return paramsArray}
}  
