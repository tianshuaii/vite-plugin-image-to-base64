import fs from "node:fs"

const devImageToBase64Plugin = (limit = 4096) => {
  return {
    name: "vite-plugin-inline-images",
    async transform(code, id) {
      if (process.env.NODE_ENV !== "development") {
        return
      }

      // 只处理 .png 和 .jpg 文件
      if (!id.endsWith(".png") && !id.endsWith(".jpg")) {
        return
      }

      const stat = await fs.promises.stat(id)
      if (stat.size > limit) {
        return
      }

      const buffer = await fs.promises.readFile(id)
      const base64 = buffer.toString("base64")
      const dataurl = `data:image/png;base64,${base64}`

      return {
        code: `export default ${JSON.stringify(dataurl)}`,
      }
    },
  }
}

export default devImageToBase64Plugin
