import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  List,
  ListItem,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import * as XLSX from "xlsx";

export default function ExcelConveterToPage() {
  const allowedExtensions = ["xls", "xlsx"];
  const acceptString = allowedExtensions.map((ext) => `.${ext}`).join(",");

  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [convertOptions, setConvertOptions] = useState({
    json: true,
    csv: true,
  });

  // 파일 필터링
  const filterFiles = (fileList) => {
    const filtered = Array.from(fileList).filter((f) => {
      const ext = f.name.split(".").pop().toLowerCase();
      return allowedExtensions.includes(ext);
    });

    if (filtered.length === 0) {
      setError(`엑셀 파일(.${allowedExtensions.join(",.")})만 업로드 가능합니다.`);
      setFiles([]);
    } else {
      setError("");
      setFiles(filtered);
    }
  };

  // 드래그 앤 드롭
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      filterFiles(e.dataTransfer.files);
    }
  };

  // 파일 선택
  const handleFileChange = (e) => {
    if (!e.target.files) return;
    filterFiles(e.target.files);
  };

  // 공통 다운로드 함수
  const downloadSheet = (worksheet, sheetName, type) => {
    let blob, fileName;

    if (type === "json") {
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
      fileName = `${sheetName}.json`;
    } else if (type === "csv") {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      blob = new Blob([csv], { type: "text/csv" });
      fileName = `${sheetName}.csv`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  // 파일 변환
  const handleConvert = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];

        Object.entries(convertOptions)
          .filter(([_, value]) => value)
          .forEach(([type]) => downloadSheet(worksheet, sheetName, type));
      });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Stack alignItems="center" spacing={4} sx={{ p: 2 }}>
      {/* 업로드 카드 */}
      <Card
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        sx={{
          width: { xs: "90vw", sm: 500, md: 600 },
          minHeight: 250,
          maxWidth: 700,
          borderRadius: 3,
          border: `2px dashed ${dragOver ? "#1976d2" : "#ccc"}`,
          backgroundColor: dragOver ? "#e3f2fd" : "#fff",
          boxShadow: dragOver
            ? "0 12px 28px rgba(25, 118, 210, 0.25)"
            : "0 8px 24px rgba(0,0,0,0.1)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          p: 2,
          gap: 1,
        }}
      >
        {/* 단일 파일 업로드 */}
        <input
          type="file"
          style={{ display: "none" }}
          id="upload-single-file"
          multiple
          accept={acceptString}
          onChange={handleFileChange}
        />
        <label htmlFor="upload-single-file">
          <Button variant="contained" component="span">
            파일 업로드
          </Button>
        </label>

        {/* 폴더 업로드 */}
        <input
          type="file"
          style={{ display: "none" }}
          id="upload-folder"
          webkitdirectory
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="upload-folder">
          <Button variant="outlined" component="span">
            폴더 업로드
          </Button>
        </label>

        {/* 변환 옵션 */}
        <Stack direction="row" spacing={2} mt={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={convertOptions.json}
                onChange={(e) =>
                  setConvertOptions((prev) => ({ ...prev, json: e.target.checked }))
                }
              />
            }
            label="JSON"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={convertOptions.csv}
                onChange={(e) =>
                  setConvertOptions((prev) => ({ ...prev, csv: e.target.checked }))
                }
              />
            }
            label="CSV"
          />
        </Stack>

        {/* 상태 표시 */}
        <Typography
          sx={{
            mt: 1,
            color: error ? "red" : "gray",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {error
            ? error
            : files.length > 0
            ? `선택된 파일: ${files.map((f) => f.name).join(", ")}`
            : `폴더나 엑셀 파일(.${allowedExtensions.join(
                ",."
              )})을 드래그하거나 클릭하세요`}
        </Typography>

        {/* 파일 리스트 */}
        {files.length > 0 && (
          <>
            <List sx={{ maxHeight: 150, overflow: "auto", width: "100%" }}>
              {files.map((f, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  {f.name}
                  <Button size="small" sx={{ ml: 2 }} onClick={() => handleConvert(f)}>
                    변환
                  </Button>
                </ListItem>
              ))}
            </List>

            {/* 전체 변환 버튼 */}
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => files.forEach(handleConvert)}
            >
              전체 변환
            </Button>
          </>
        )}
      </Card>
    </Stack>
  );
}
