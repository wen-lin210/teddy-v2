import {
  readdirSync,
  statSync,
  unlinkSync
} from "fs";
import { join } from "path";
import { isTermux, tryForceGC } from "../../src/Core/helpers/runtime.js";

try {
  const cachePaths = [
    "./src/Core/data/cache/",
  ];
  
  const excludeFiles = ["README.txt", "spam.txt", "autorep.json"];
  
  cachePaths.forEach(path => {
    try {
      const files = readdirSync(path);
      let deletedCount = 0;
      
      files.forEach(file => {
        if (excludeFiles.includes(file)) return;
        
        const filePath = join(path, file);
        try {
          const stats = statSync(filePath);
          
          if (stats.isFile()) {
            const isOld = isTermux && (Date.now() - stats.mtimeMs > 86400000);
            const isLarge = isTermux && (stats.size > 5 * 1024 * 1024);
            
            if (!isTermux || isOld || isLarge) {
              unlinkSync(filePath);
              deletedCount++;
            }
          }
        } catch (err) {
          // Skip files that can't be accessed
        }
      });
      
      if (isTermux && deletedCount > 0) {
        console.log(`✓ Đã dọn ${deletedCount} file cache trong ${path}`);
      }
    } catch (err) {
      // Skip directories that don't exist
    }
  });
  
  if (isTermux && tryForceGC()) {
    console.log("✓ Đã giải phóng bộ nhớ");
  }
} catch (err) {
  console.error("Lỗi khi cleanup:", err.message);
}