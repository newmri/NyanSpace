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

  // ================= 파일 필터링 =================
  const filterFiles = (fileList) => {
    const allFiles = Array.from(fileList);
    const filtered = allFiles.filter((f) => {
      const fileName = f.name.split("/").pop(); // 경로 포함돼도 마지막 파일 이름만
      const ext = fileName.split(".").pop().toLowerCase();
      return allowedExtensions.includes(ext);
    });

    if (filtered.length === 0) {
      setError(
        `엑셀 파일(.${allowedExtensions.join(",.")})만 업로드 가능합니다.`,
      );
      return;
    }

    setError("");
    setFiles((prevFiles) => {
      const merged = [...prevFiles, ...filtered];
      // 중복 제거 (이름+크기 기준)
      const unique = merged.filter(
        (file, index, self) =>
          index ===
          self.findIndex((f) => f.name === file.name && f.size === file.size),
      );
      return unique;
    });
  };

  // ================= 드래그 & 드롭 =================
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);

    const items = e.dataTransfer.items;
    if (!items) return;

    const fileEntries = [];

    const traverseFileTree = (item, path = "") => {
      return new Promise((resolve) => {
        if (item.isFile) {
          item.file((file) => {
            fileEntries.push(file);
            resolve();
          });
        } else if (item.isDirectory) {
          const dirReader = item.createReader();
          dirReader.readEntries(async (entries) => {
            for (const entry of entries) {
              await traverseFileTree(entry, path + item.name + "/");
            }
            resolve();
          });
        }
      });
    };

    // 모든 드롭된 항목에 대해 처리
    const promises = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        promises.push(traverseFileTree(item));
      }
    }

    await Promise.all(promises);

    if (fileEntries.length > 0) {
      filterFiles(fileEntries);
    }
  };

  // ================= 파일 선택 =================
  const handleFileChange = (e) => {
    if (!e.target.files) return;
    filterFiles(e.target.files);
  };

  // ================= 엑셀 변환 =================
  const downloadSheet = (worksheet, sheetName, type) => {
    let blob, fileName;

    if (type === "json") {
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
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

  // ================= 렌더링 =================
  return (
    <Stack alignItems="center" spacing={4} sx={{ p: 2 }}>
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
        <Button
          variant="contained"
          onClick={() => document.getElementById("upload-single-file").click()}
        >
          파일 업로드
        </Button>

        {/* 폴더 업로드 */}
        <input
          type="file"
          style={{ display: "none" }}
          id="upload-folder"
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleFileChange}
        />
        <Button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById("upload-folder").click();
          }}
        >
          폴더 업로드
        </Button>

        {/* 변환 옵션 */}
        <Stack direction="row" spacing={2} mt={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={convertOptions.json}
                onChange={(e) =>
                  setConvertOptions((prev) => ({
                    ...prev,
                    json: e.target.checked,
                  }))
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
                  setConvertOptions((prev) => ({
                    ...prev,
                    csv: e.target.checked,
                  }))
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
              : `폴더나 엑셀 파일(.${allowedExtensions.join(",.")})을 드래그하거나 클릭하세요`}
        </Typography>

        {/* 파일 리스트 */}
        {files.length > 0 && (
          <>
            <List sx={{ maxHeight: 150, overflow: "auto", width: "100%" }}>
              {files.map((f, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  {f.name}
                  <Button
                    size="small"
                    sx={{ ml: 2 }}
                    onClick={() => handleConvert(f)}
                  >
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
