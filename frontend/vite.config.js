import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Hàm tự động tìm file index.js của thư viện
// Nó sẽ tìm ở thư mục frontend trước, nếu không thấy thì tìm ra thư mục cha (gốc)
function findLibraryPath(libName) {
  const localPath = path.resolve(__dirname, 'node_modules', libName, 'index.js');
  const rootPath = path.resolve(__dirname, '../node_modules', libName, 'index.js'); // Tìm ở thư mục cha

  if (fs.existsSync(localPath)) {
    return localPath;
  } else if (fs.existsSync(rootPath)) {
    return rootPath;
  }
  // Nếu không tìm thấy file nào, trả về tên thư viện để Vite tự xử lý (có thể vẫn lỗi nhưng đỡ hơn)
  return libName;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Gọi hàm tìm đường dẫn tuyệt đối để bypass lỗi Node v24
      raf: findLibraryPath('raf'),
      rgbcolor: findLibraryPath('rgbcolor'),
    },
  },
  optimizeDeps: {
    include: ['raf', 'rgbcolor'],
  },
})