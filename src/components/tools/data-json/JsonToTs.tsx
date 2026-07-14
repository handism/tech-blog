// src/components/tools/data-json/JsonToTs.tsx
'use client';

import { useState, useMemo } from 'react';
import { Clipboard, RefreshCw } from 'lucide-react';
import CopyButton from '@/src/components/CopyButton';

export default function JsonToTs() {
  const [inputJson, setInputJson] = useState(
    '{\n  "id": 1,\n  "name": "Jane Doe",\n  "isActive": true,\n  "roles": ["admin", "editor"],\n  "profile": {\n    "age": 28,\n    "bio": "Software Engineer"\n  }\n}'
  );
  const [rootName, setRootName] = useState('User');
  const [outputFormat, setOutputFormat] = useState<'interface' | 'type' | 'zod'>('interface');

  const { outputCode, error } = useMemo(() => {
    if (!inputJson.trim()) {
      return { outputCode: '', error: '' };
    }

    try {
      const parsed = JSON.parse(inputJson);
      const generated = generateTypes(parsed, rootName || 'Root', outputFormat);
      return { outputCode: generated, error: '' };
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      return {
        outputCode: '',
        error: `JSON解析エラー: ${errorMessage}`,
      };
    }
  }, [inputJson, rootName, outputFormat]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, 2));
    } catch (e: unknown) {
      console.error(e);
    }
  };

  function generateTypes(
    value: unknown,
    typeName: string,
    format: 'interface' | 'type' | 'zod'
  ): string {
    const generatedTypes: string[] = [];
    const seenNames = new Set<string>();

    function capitalize(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function resolveType(val: unknown, currentKey: string): string {
      if (val === null) return 'null';
      if (Array.isArray(val)) {
        if (val.length === 0) return 'any[]';
        const itemTypes = Array.from(new Set(val.map((item) => resolveType(item, currentKey))));
        if (itemTypes.length === 1) {
          return `${itemTypes[0]}[]`;
        }
        return `(${itemTypes.join(' | ')})[]`;
      }
      if (typeof val === 'object') {
        const nestedName = capitalize(currentKey);
        if (!seenNames.has(nestedName)) {
          seenNames.add(nestedName);
          buildType(val as Record<string, unknown>, nestedName);
        }
        return nestedName;
      }
      return typeof val;
    }

    function resolveZod(val: unknown, currentKey: string, indent: string = '  '): string {
      if (val === null) return 'z.null()';
      if (Array.isArray(val)) {
        if (val.length === 0) return 'z.array(z.any())';
        const itemTypes = Array.from(
          new Set(val.map((item) => resolveZod(item, currentKey, indent)))
        );
        if (itemTypes.length === 1) {
          return `z.array(${itemTypes[0]})`;
        }
        return `z.array(z.union([${itemTypes.join(', ')}]))`;
      }
      if (typeof val === 'object') {
        return buildZod(val as Record<string, unknown>, indent + '  ');
      }
      if (typeof val === 'string') return 'z.string()';
      if (typeof val === 'number') return 'z.number()';
      if (typeof val === 'boolean') return 'z.boolean()';
      return 'z.any()';
    }

    function buildType(obj: Record<string, unknown>, name: string) {
      const keys = Object.keys(obj);
      let output = '';
      if (format === 'interface') {
        output += `export interface ${name} {\n`;
        for (const key of keys) {
          const typeStr = resolveType(obj[key], key);
          output += `  ${key}: ${typeStr};\n`;
        }
        output += `}`;
      } else {
        output += `export type ${name} = {\n`;
        for (const key of keys) {
          const typeStr = resolveType(obj[key], key);
          output += `  ${key}: ${typeStr};\n`;
        }
        output += `};`;
      }
      generatedTypes.push(output);
    }

    function buildZod(obj: Record<string, unknown>, indent: string): string {
      const keys = Object.keys(obj);
      if (keys.length === 0) return 'z.object({})';

      let output = 'z.object({\n';
      for (const key of keys) {
        const zodStr = resolveZod(obj[key], key, indent);
        output += `${indent}${key}: ${zodStr},\n`;
      }
      output += `${indent.slice(2)})`;
      return output;
    }

    if (value === null || typeof value !== 'object') {
      return `// 入力データはオブジェクトまたは配列である必要があります。`;
    }

    if (format === 'zod') {
      const zodStr = resolveZod(value, typeName, '  ');
      return `import { z } from 'zod';\n\nexport const ${typeName}Schema = ${zodStr};\n\nexport type ${typeName} = z.infer<typeof ${typeName}Schema>;`;
    } else {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return `export type ${typeName} = any[];`;
        }
        const sample = value[0];
        if (typeof sample === 'object' && sample !== null) {
          buildType(sample as Record<string, unknown>, typeName + 'Item');
          return generatedTypes.join('\n\n') + `\n\nexport type ${typeName} = ${typeName}Item[];`;
        } else {
          const typeStr = resolveType(sample, typeName);
          return `export type ${typeName} = ${typeStr}[];`;
        }
      }
      buildType(value as Record<string, unknown>, typeName);
      return generatedTypes.reverse().join('\n\n');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 入力パネル */}
      <div className="theme-card p-5 md:p-6 flex flex-col h-[600px]">
        <div className="flex justify-between items-center mb-4">
          <label
            htmlFor="json-input"
            className="text-sm font-bold text-text flex items-center gap-2"
          >
            <span>📥 JSON入力</span>
          </label>
          <button
            onClick={handleFormat}
            className="theme-btn px-3 py-1 text-xs text-text flex items-center gap-1 bg-secondary font-bold"
          >
            <RefreshCw className="w-3 h-3" />
            整形
          </button>
        </div>
        <textarea
          id="json-input"
          className="w-full flex-1 p-4 border-2 border-border rounded-xl font-mono text-sm bg-card text-text focus:outline-none focus:ring-0 resize-none overflow-y-auto"
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          placeholder="ここにJSONデータを貼り付けてください..."
        />
        {error && (
          <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-xl text-red-700 dark:text-red-300 text-xs font-bold break-all">
            {error}
          </div>
        )}
      </div>

      {/* 出力パネル */}
      <div className="theme-card p-5 md:p-6 flex flex-col h-[600px]">
        <div className="space-y-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">ルートの型名:</span>
              <input
                type="text"
                className="px-3 py-1.5 border-2 border-border rounded-xl text-sm font-bold bg-card text-text w-32 focus:outline-none"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                placeholder="Root"
              />
            </div>
            <div className="flex gap-2">
              {(['interface', 'type', 'zod'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setOutputFormat(format)}
                  className={`px-3 py-1.5 rounded-xl border-2 border-border text-xs font-extrabold cursor-pointer transition-all ${
                    outputFormat === format
                      ? 'bg-accent text-white shadow-none translate-x-[1px] translate-y-[1px]'
                      : 'bg-card text-text shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none'
                  }`}
                >
                  {format === 'interface' && 'Interface'}
                  {format === 'type' && 'Type'}
                  {format === 'zod' && 'Zod Schema'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex-1 min-h-0">
          {outputCode ? (
            <CopyButton
              value={outputCode}
              label=""
              copiedLabel=""
              icon={Clipboard}
              iconClassName="w-4 h-4"
              copiedIconClassName="w-4 h-4 text-accent"
              title="コードをコピー"
              className="absolute top-4 right-4 z-10 theme-btn p-2 bg-secondary text-text flex items-center justify-center font-bold"
            />
          ) : null}
          <pre className="w-full h-full p-4 border-2 border-border rounded-xl font-mono text-sm bg-slate-950 text-slate-100 overflow-y-auto whitespace-pre">
            {outputCode || '// 有効なJSONが入力されると、ここにコードが生成されます。'}
          </pre>
        </div>
      </div>
    </div>
  );
}
