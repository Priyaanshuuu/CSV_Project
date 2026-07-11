import multer from "multer";

const MAX_FILE_SIZE =
  Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_, file, cb) => {
  const isCSV =
    file.mimetype === "text/csv" ||
    file.originalname.toLowerCase().endsWith(".csv");

  if (!isCSV) {
    return cb(new Error("Only CSV files are allowed."));
  }

  cb(null, true);
};

export const uploadCSV = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});