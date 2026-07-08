// src/components/tools/network/HttpStatusData.ts

export interface HttpStatusCode {
  code: number;
  phrase: string;
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx';
  description: string;
  details: string;
  commonHeaders?: string[];
  mockResponse?: string;
  mdnUrl: string;
}

export const HTTP_STATUS_CODES: HttpStatusCode[] = [
  // 1xx Informational
  {
    code: 100,
    phrase: 'Continue',
    category: '1xx',
    description:
      'リクエストの初期部分が受け入れられ、クライアントが送信を続行してよいことを示します。',
    details:
      '巨大なファイルをアップロードする前に、サーバーがリクエストを受け入れる準備ができているか確認する際（Expect: 100-continue ヘッダーなど）によく使われます。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/100',
  },
  {
    code: 101,
    phrase: 'Switching Protocols',
    category: '1xx',
    description:
      'クライアントからの要求に応じて、サーバーが通信プロトコルを切り替えることを示します。',
    details:
      'HTTP/1.1 から WebSocket 通信へ接続をアップグレードする際（Upgrade ヘッダー）に使用される代表的なステータスコードです。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/101',
  },
  {
    code: 102,
    phrase: 'Processing',
    category: '1xx',
    description: 'サーバーがリクエストを受け取り処理中であるが、まだ完了していないことを示します。',
    details:
      'WebDAV規格で定義されており、時間のかかる処理においてタイムアウトを避けるために中間応答として送信されます。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/102',
  },
  {
    code: 103,
    phrase: 'Early Hints',
    category: '1xx',
    description:
      'サーバーが主要なレスポンスの前に、Linkヘッダー等を先行して送信できることを示します。',
    details:
      'ブラウザがHTMLの本体を受け取る前に、必要なCSSやJSリソースの事前ロード（preload）を開始できるため、ページの表示速度（LCP）を向上させるために使われます。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/103',
  },

  // 2xx Success
  {
    code: 200,
    phrase: 'OK',
    category: '2xx',
    description: 'リクエストが成功し、要求された情報がレスポンスに含まれていることを示します。',
    details:
      '最も一般的な成功ステータスです。GETでは取得結果、POST/PUTでは処理結果のドキュメントがボディに含まれます。',
    mockResponse:
      '{\n  "status": "success",\n  "data": {\n    "message": "リクエスト処理が成功しました"\n  }\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/200',
  },
  {
    code: 201,
    phrase: 'Created',
    category: '2xx',
    description: 'リクエストが成功し、サーバー上に新しいリソースが作成されたことを示します。',
    details:
      '通常、POSTやPUTによる作成処理の完了時に返されます。新しく作成されたリソースのURLは、Location ヘッダーで示されるのがベストプラクティスです。',
    commonHeaders: ['Location'],
    mockResponse:
      '{\n  "id": 1024,\n  "createdAt": "2026-06-25T12:00:00Z",\n  "status": "created"\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/201',
  },
  {
    code: 202,
    phrase: 'Accepted',
    category: '2xx',
    description:
      'リクエストは受け入れられましたが、まだ処理が完了していない（非异步処理）ことを示します。',
    details:
      'バッチ処理やキューにタスクを登録するような、完了まで時間がかかるバックグラウンド処理を開始するAPIで返されます。',
    mockResponse:
      '{\n  "jobId": "job-abc-12345",\n  "status": "queued",\n  "checkStatusUrl": "/api/jobs/job-abc-12345"\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/202',
  },
  {
    code: 204,
    phrase: 'No Content',
    category: '2xx',
    description: 'リクエストは成功しましたが、レスポンスボディには返すデータがないことを示します。',
    details:
      'リソースの削除（DELETE）に成功したときや、情報を更新するだけで結果を返す必要がないPOST/PUT処理、あるいはPreflight（OPTIONS）リクエストの応答で使用されます。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/204',
  },
  {
    code: 206,
    phrase: 'Partial Content',
    category: '2xx',
    description:
      'クライアントが Range ヘッダーで指定した、リソースの一部（範囲）を返していることを示します。',
    details:
      '大容量ファイルの分割ダウンロード、動画や音声のシークストリーミング再生、ダウンロードの中断からの再開などで使用されます。',
    commonHeaders: ['Content-Range', 'Accept-Ranges'],
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/206',
  },

  // 3xx Redirection
  {
    code: 301,
    phrase: 'Moved Permanently',
    category: '3xx',
    description: 'リクエストされたリソースが、恒久的に別のLocationに移動したことを示します。',
    details:
      'URLスキームの変更（httpからhttpsへの転送）や、ドメインの移行時によく使われます。検索エンジンのクローラーは、SEOの評価（リンクジュース）を移動先に引き継ぎます。',
    commonHeaders: ['Location'],
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/301',
  },
  {
    code: 302,
    phrase: 'Found (Moved Temporarily)',
    category: '3xx',
    description: 'リクエストされたリソースが、一時的に別のLocationに移動していることを示します。',
    details:
      'ログイン後のダッシュボードへの一時リダイレクトなどに使われます。301と異なり、検索エンジンのSEO評価は元のURLのまま維持されます。',
    commonHeaders: ['Location'],
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/302',
  },
  {
    code: 303,
    phrase: 'See Other',
    category: '3xx',
    description:
      'リクエストの処理完了後、クライアントにGETメソッドで別のリソースを参照するよう指示します。',
    details:
      'POSTでフォームを送信し、重複送信を防ぐために結果画面（GET）に転送する設計（Redirect After Postパターン）で頻繁に使用されます。',
    commonHeaders: ['Location'],
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/303',
  },
  {
    code: 304,
    phrase: 'Not Modified',
    category: '3xx',
    description: 'リソースが前回のアクセスから更新されていないため、キャッシュの利用を許可します。',
    details:
      'ブラウザがキャッシュしたデータ（ETag や If-Modified-Since ヘッダー）と比較して差分がない場合、無駄なデータ転送を防ぐためにレスポンスボディなしで返されます。',
    commonHeaders: ['ETag', 'Cache-Control'],
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/304',
  },
  {
    code: 307,
    phrase: 'Temporary Redirect',
    category: '3xx',
    description: 'リクエストメソッドを変更せずに、一時的に別のLocationへリダイレクトします。',
    details:
      '302と似ていますが、リダイレクト時にPOSTリクエストをGETに書き換えることをブラウザに禁止します（POSTのままリダイレクト先に再送します）。',
    commonHeaders: ['Location'],
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/307',
  },
  {
    code: 308,
    phrase: 'Permanent Redirect',
    category: '3xx',
    description: 'リクエストメソッドを変更せずに、恒久的に別のLocationへリダイレクトします。',
    details: '301と似ていますが、リダイレクト時にPOSTリクエストをGETに書き換えることを禁止します。',
    commonHeaders: ['Location'],
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/308',
  },

  // 4xx Client Error
  {
    code: 400,
    phrase: 'Bad Request',
    category: '4xx',
    description:
      'リクエストの構文エラーやパラメータの不足など、クライアント側に原因があるエラーです。',
    details:
      'APIの入力バリデーションエラー、不正なJSONフォーマットの送信、必須ヘッダーの欠如などに対して返されます。',
    mockResponse:
      '{\n  "error": "bad_request",\n  "message": "パラメータ \\"userId\\" が不足しています。"\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/400',
  },
  {
    code: 401,
    phrase: 'Unauthorized',
    category: '4xx',
    description:
      'リクエストには適切な認証資格（認証トークンやID・パスワード）が不足していることを示します。',
    details:
      '「未認証」という意味です。ログインしていない状態で認証必須のAPIを実行したときに返されます。',
    commonHeaders: ['WWW-Authenticate'],
    mockResponse:
      '{\n  "error": "unauthorized",\n  "message": "認証トークンが無効または有効期限切れです。"\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/401',
  },
  {
    code: 403,
    phrase: 'Forbidden',
    category: '4xx',
    description: '認証はされていますが、要求されたリソースへのアクセス権限がないことを示します。',
    details:
      '「認可エラー（権限不足）」です。一般ユーザーが管理者向け画面にアクセスした場合などに返されます。',
    mockResponse:
      '{\n  "error": "forbidden",\n  "message": "このリソースへのアクセス権限がありません。"\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/403',
  },
  {
    code: 404,
    phrase: 'Not Found',
    category: '4xx',
    description: '指定されたURL（リソース）がサーバー上に存在しないことを示します。',
    details:
      '最もよく知られたエラーコードです。URLの入力間違いのほか、削除されたリソースへのアクセス、あるいは存在自体を隠蔽したい場合（403の代わりに404にする）にも使われます。',
    mockResponse:
      '{\n  "error": "not_found",\n  "message": "指定されたユーザーIDは見つかりませんでした。"\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/404',
  },
  {
    code: 405,
    phrase: 'Method Not Allowed',
    category: '4xx',
    description:
      'リクエストされたURLに対し、そのHTTPメソッド（GET, POSTなど）の実行が禁止されていることを示します。',
    details:
      '例えば、取得専用のAPIに対してPOSTやDELETEでアクセスした場合に返されます。利用可能なメソッドを Allow ヘッダーで返します。',
    commonHeaders: ['Allow'],
    mockResponse:
      '{\n  "error": "method_not_allowed",\n  "message": "POSTメソッドはサポートされていません。"\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/405',
  },
  {
    code: 406,
    phrase: 'Not Acceptable',
    category: '4xx',
    description:
      '要求されたコンテンツ形式が、クライアントの許容する Accept ヘッダーに合致しないことを示します。',
    details:
      'クライアントが「日本語のコンテンツだけを求めている（Accept-Language: ja）」のに対し、サーバーが「英語しか用意できない」場合などに対応します。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/406',
  },
  {
    code: 408,
    phrase: 'Request Timeout',
    category: '4xx',
    description:
      'サーバーが接続を維持したままクライアントからのリクエスト入力を待つ制限時間を超えたことを示します。',
    details: 'クライアント側の通信速度が非常に遅い、あるいは途中で途切れた場合に発生します。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/408',
  },
  {
    code: 409,
    phrase: 'Conflict',
    category: '4xx',
    description:
      'サーバーの現在のリソース状態と、リクエストが競合（コンフリクト）していることを示します。',
    details:
      'すでに登録済みのメールアドレスで重複登録しようとした場合や、古いバージョンを元に変更された競合を検知（楽観的排他制御など）したときに使用します。',
    mockResponse:
      '{\n  "error": "conflict",\n  "message": "このメールアドレスは既に登録されています。"\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/409',
  },
  {
    code: 410,
    phrase: 'Gone',
    category: '4xx',
    description:
      'リクエストされたリソースが以前存在していましたが、現在は恒久的に削除され復活の予定もないことを示します。',
    details:
      '404と異なり、その場所にあったデータが意図的に削除されたことが明確な場合にSEOクロール効率を考慮して使われます。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/410',
  },
  {
    code: 413,
    phrase: 'Payload Too Large',
    category: '4xx',
    description:
      '送信されたリクエストのボディサイズが、サーバーの制限値を超えていることを示します。',
    details: '制限サイズ以上の大きな画像やファイルをアップロードしようとした際によく返されます。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/413',
  },
  {
    code: 415,
    phrase: 'Unsupported Media Type',
    category: '4xx',
    description:
      'リクエストのデータ形式（Content-Typeなど）が、サーバーでサポートされていないことを示します。',
    details:
      'JSON形式でのデータ送信を要求しているAPIに対して、XML形式や `multipart/form-data` 形式でリクエストを送った場合などに返されます。',
    mockResponse:
      '{\n  "error": "unsupported_media_type",\n  "message": "Content-Typeは \\"application/json\\" である必要があります。"\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/415',
  },
  {
    code: 422,
    phrase: 'Unprocessable Entity',
    category: '4xx',
    description:
      'リクエストの構文は正しいが、指示された内容がビジネスロジック等の規則に反していることを示します。',
    details:
      'WebDAV規格由来ですが、現在のWeb API開発では、JSONのパースはできたが、入力値の値検証（数値範囲、必須文字列パターンチェックなど）で論理的に弾かれた際に広く使われます。',
    mockResponse:
      '{\n  "error": "validation_failed",\n  "details": [\n    { "field": "age", "message": "年齢は0以上である必要があります。" }\n  ]\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/422',
  },
  {
    code: 429,
    phrase: 'Too Many Requests',
    category: '4xx',
    description:
      '短時間のうちに、クライアントが設定されたレート制限（アクセス回数制限）を超えたリクエストを送信したことを示します。',
    details:
      'APIの乱用防止やDDoS対策（Rate Limit）で使用されます。通常、再試行可能なまでの待ち時間を秒数で示す `Retry-After` ヘッダーを付与します。',
    commonHeaders: ['Retry-After', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    mockResponse:
      '{\n  "error": "rate_limit_exceeded",\n  "message": "アクセス制限を超過しました。しばらく経ってから再試行してください。"\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/429',
  },

  // 5xx Server Error
  {
    code: 500,
    phrase: 'Internal Server Error',
    category: '5xx',
    description:
      'サーバー内部で予期しない問題が発生し、リクエストを完了できなかったことを示します。',
    details:
      'プログラム内での未キャッチ例外の発生、データベース接続の切断、設定ファイルの重大なバグなど、サーバーサイドの開発で最も避けるべき汎用エラーコードです。',
    mockResponse:
      '{\n  "error": "internal_server_error",\n  "message": "サーバー内部で予期しないエラーが発生しました。"\n}',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/500',
  },
  {
    code: 501,
    phrase: 'Not Implemented',
    category: '5xx',
    description:
      'サーバーがリクエストを完了するのに必要な機能をサポート（実装）していないことを示します。',
    details:
      'サーバーが対応していないメソッド（例えば、未知のカスタムメソッドなど）を受け取った場合に使用されます。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/501',
  },
  {
    code: 502,
    phrase: 'Bad Gateway',
    category: '5xx',
    description:
      'ゲートウェイやプロキシとして動作しているサーバーが、上位サーバーから無効な応答を受け取ったことを示します。',
    details:
      'Nginxなどのリバースプロキシが、背後で動いているNode.jsやPythonなどのアプリケーションサーバーの停止・クラッシュを検知した際によく発生します。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/502',
  },
  {
    code: 503,
    phrase: 'Service Unavailable',
    category: '5xx',
    description:
      'サーバーが一時的に過負荷状態にあるか、メンテナンス中であるためリクエストを処理できないことを示します。',
    details:
      '通常、一時的な障害や計画メンテナンスで返されます。再復帰の予定時間を `Retry-After` ヘッダーでクライアントに伝えることが推奨されます。',
    commonHeaders: ['Retry-After'],
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/503',
  },
  {
    code: 504,
    phrase: 'Gateway Timeout',
    category: '5xx',
    description:
      'ゲートウェイやプロキシとして動作しているサーバーが、上位サーバーからの応答制限時間内に返答を得られなかったことを示します。',
    details:
      'アプリケーションの処理が重すぎてタイムアウト（30秒や60秒などの制限）に達し、プロキシ層が接続を切断してエラーを返す状況で発生します。',
    mdnUrl: 'https://developer.mozilla.org/ja/docs/Web/HTTP/Status/504',
  },
];
