#!/usr/bin/env python3
"""
数据更新脚本
用法：
  1. 把导出的 JSON 文件放在本目录下，命名为 sites.json
  2. 运行：python update_data.py
  3. 脚本会自动更新 src/App.tsx 中的数据
  4. 然后执行 git add . && git commit -m "Update data" && git push
"""

import json
import re
import sys
from pathlib import Path

def main():
    # 读取 JSON 数据
    json_path = Path(__file__).parent / "sites.json"
    if not json_path.exists():
        print("错误：找不到 sites.json 文件")
        print("请把导出的 JSON 文件放在本目录下，并命名为 sites.json")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        sites = json.load(f)

    print(f"读取到 {len(sites)} 个网站")

    # 生成 TypeScript 代码
    lines = ["const defaultSites: Site[] = ["]
    for i, s in enumerate(sites):
        desc = s.get("description", "").replace('"', '\\"').replace("\n", "\\n")
        name = s.get("name", "").replace('"', '\\"')
        cat = s.get("category", "").replace('"', '\\"')
        url = s.get("url", "").replace('"', '\\"')
        screenshot = s.get("screenshotBase64", "")

        lines.append(f"  {{")
        lines.append(f"    id: {s.get('id', i)},")
        lines.append(f'    name: "{name}",')
        lines.append(f'    url: "{url}",')
        lines.append(f'    description: "{desc}",')
        lines.append(f'    category: "{cat}",')
        lines.append(f'    screenshotBase64: "{screenshot}",')
        lines.append(f"    createdAt: {s.get('createdAt', 0)},")
        lines.append(f"    isFavorite: {'true' if s.get('isFavorite') else 'false'}")
        lines.append(f"  }}{',' if i < len(sites) - 1 else ''}")
    lines.append("];")

    new_data = "\n".join(lines)

    # 读取 App.tsx
    app_path = Path(__file__).parent / "src" / "App.tsx"
    with open(app_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 替换 defaultSites
    pattern = r"const defaultSites: Site\[\] = \[.*?\];"
    if not re.search(pattern, content, re.DOTALL):
        print("错误：在 App.tsx 中找不到 defaultSites 数组")
        sys.exit(1)

    new_content = re.sub(pattern, new_data, content, flags=re.DOTALL)

    # 写回
    with open(app_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    # 删除 sites.json（避免误提交）
    json_path.unlink()

    print("✅ 数据更新成功！")
    print("")
    print("下一步请执行：")
    print("  git add .")
    print('  git commit -m "Update site data"')
    print("  git push")
    print("")
    print("Vercel 会自动重新部署")

if __name__ == "__main__":
    main()
