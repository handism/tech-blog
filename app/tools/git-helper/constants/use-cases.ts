export interface Param {
  key: string;
  label: string;
  placeholder: string;
  defaultValue: string;
}

export interface GitUseCase {
  id: string;
  category: 'commit' | 'branch' | 'undo' | 'remote' | 'history';
  title: string;
  description: string;
  template: string;
  params: Param[];
  warning?: string;
}

export const CATEGORIES = [
  { id: 'all', name: 'すべて', emoji: '📂' },
  { id: 'commit', name: 'コミット', emoji: '💾' },
  { id: 'branch', name: 'ブランチ操作', emoji: '🌿' },
  { id: 'undo', name: '取り消し・復旧', emoji: '⚠️' },
  { id: 'remote', name: 'リモート同期', emoji: '☁️' },
  { id: 'history', name: '履歴・ログ', emoji: '📊' },
] as const;

export const USE_CASES: GitUseCase[] = [
  {
    id: 'commit-amend-message',
    category: 'commit',
    title: '直前のコミットメッセージを修正する',
    description:
      'まだリモートにプッシュしていない直前のローカルコミットのメッセージを上書き修正します。',
    template: 'git commit --amend -m "[message]"',
    params: [
      {
        key: 'message',
        label: '新しいメッセージ',
        placeholder: 'fix: 軽微なバグの修正',
        defaultValue: 'fix: typo',
      },
    ],
    warning:
      '既にリモートにプッシュされているコミットのメッセージを書き換えると、履歴の競合が発生します。',
  },
  {
    id: 'commit-amend-file',
    category: 'commit',
    title: '変更ファイルを直前のコミットに含める',
    description:
      'コミットし忘れたファイルを、新規のコミットを作らずに直前のコミットへ追加統合します。',
    template: 'git add [file_path]\ngit commit --amend --no-edit',
    params: [
      {
        key: 'file_path',
        label: '追加するファイルパス',
        placeholder: 'src/components/Header.tsx',
        defaultValue: 'src/index.css',
      },
    ],
  },
  {
    id: 'branch-create',
    category: 'branch',
    title: '新しいブランチを作成して切り替える',
    description:
      '現在のブランチから新しい作業用ブランチを作成し、同時にそのブランチにチェックアウトします。',
    template: 'git checkout -b [branch_name]',
    params: [
      {
        key: 'branch_name',
        label: '作成するブランチ名',
        placeholder: 'feature/new-button',
        defaultValue: 'feature/login',
      },
    ],
  },
  {
    id: 'branch-delete-local',
    category: 'branch',
    title: 'ローカルブランチを強制削除する',
    description: 'マージ済みの有無に関わらず、不要になったローカルのブランチを強制的に削除します。',
    template: 'git branch -D [branch_name]',
    params: [
      {
        key: 'branch_name',
        label: '削除するブランチ名',
        placeholder: 'feature/old-test',
        defaultValue: 'feature/abandoned',
      },
    ],
    warning:
      'この操作は元に戻せません。未マージのコミットが含まれている場合、それらもすべて失われます。',
  },
  {
    id: 'branch-rename',
    category: 'branch',
    title: '現在のローカルブランチ名を変更する',
    description: '今チェックアウトしているブランチの名前を、新しい名称に変更します。',
    template: 'git branch -m [new_branch_name]',
    params: [
      {
        key: 'new_branch_name',
        label: '新しいブランチ名',
        placeholder: 'feature/revised-name',
        defaultValue: 'feature/main-update',
      },
    ],
  },
  {
    id: 'undo-revert',
    category: 'undo',
    title: '特定のコミットを打ち消す (Revert)',
    description:
      '過去のコミット履歴を残したまま、そのコミットによる変更を「打ち消すコミット」を新しく作ります。',
    template: 'git revert [commit_hash]',
    params: [
      {
        key: 'commit_hash',
        label: '打ち消したいコミットID',
        placeholder: 'a1b2c3d4',
        defaultValue: 'abc1234',
      },
    ],
  },
  {
    id: 'undo-reset-hard',
    category: 'undo',
    title: '指定したコミットまで完全に戻す (破壊的)',
    description:
      '指定したコミット以降のすべてのコミット履歴と、現在編集中の未コミットの変更をすべて破棄します。',
    template: 'git reset --hard [commit_hash]',
    params: [
      {
        key: 'commit_hash',
        label: '戻したい地点のコミットID',
        placeholder: 'a1b2c3d4',
        defaultValue: 'main',
      },
    ],
    warning:
      'この操作を実行すると、指定したコミットより新しいすべてのコミット情報と作業中の変更データが完全に消去されます。',
  },
  {
    id: 'undo-discard-file',
    category: 'undo',
    title: '特定ファイルの変更を破棄して元に戻す',
    description:
      'まだステージ（git add）していない特定ファイルの作業コピーの変更を完全に破棄して元に戻します。',
    template: 'git checkout -- [file_path]',
    params: [
      {
        key: 'file_path',
        label: '元に戻すファイルパス',
        placeholder: 'src/config/site.ts',
        defaultValue: 'src/lib/helper.ts',
      },
    ],
  },
  {
    id: 'undo-clean',
    category: 'undo',
    title: 'Git管理外のファイルを強制クリーンアップする',
    description:
      'リポジトリ内に新しく作られた、Gitの追跡対象になっていない未追跡ファイルを一括で強制削除します。',
    template: 'git clean -fd',
    params: [],
    warning:
      'この操作を実行すると、.gitignoreに指定されていない不要なファイルやフォルダが即時かつ完全に削除されます。',
  },
  {
    id: 'remote-force-push',
    category: 'remote',
    title: 'リモートブランチへ強制プッシュする',
    description:
      'ローカルリポジトリでコミット書き換え（resetやamend等）を行った後、リモートブランチを強制的に上書きします。',
    template: 'git push origin [branch_name] --force-with-lease',
    params: [
      {
        key: 'branch_name',
        label: 'プッシュ先ブランチ名',
        placeholder: 'feature/main',
        defaultValue: 'feature/login',
      },
    ],
    warning:
      '強制プッシュは他人が共有して作業しているブランチの履歴を壊す危険があります。--force-with-lease の使用を推奨します。',
  },
  {
    id: 'remote-set-url',
    category: 'remote',
    title: 'リモートリポジトリのURLを変更する',
    description:
      'GitHubの移行などでリポジトリの接続先（originなど）のURLが変更になった際の設定を書き換えます。',
    template: 'git remote set-url origin [url]',
    params: [
      {
        key: 'url',
        label: '新しいリモートURL',
        placeholder: 'git@github.com:user/repo.git',
        defaultValue: 'https://github.com/user/repo.git',
      },
    ],
  },
  {
    id: 'history-graph',
    category: 'history',
    title: 'コミット履歴を1行でグラフィカルに表示する',
    description:
      'コンソール上にブランチの分岐・合流を線画（グラフ）で表示し、コミット履歴をわかりやすく1行ずつ表示します。',
    template: 'git log --oneline --graph --all',
    params: [],
  },
  {
    id: 'history-file-log',
    category: 'history',
    title: '特定ファイルの変更履歴コミットを表示する',
    description: '指定したファイルが過去どのコミットで変更されてきたかを抽出して履歴表示します。',
    template: 'git log -p [file_path]',
    params: [
      {
        key: 'file_path',
        label: 'ファイルパス',
        placeholder: 'package.json',
        defaultValue: 'package.json',
      },
    ],
  },
];
