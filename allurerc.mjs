import { defineConfig } from "allure";

export default defineConfig({
  name: "CRM Automation Report",
  output: "reports/allure-report",
  plugins: {
    awesome: {
      options: {
        singleFile: false,
        // Chưa hỗ trợ "vi" — tên test và step vẫn hiện Tiếng Việt vì đó là dữ liệu
        reportLanguage: "en",
        groupBy: ["feature"],
      },
    },
  },
});
