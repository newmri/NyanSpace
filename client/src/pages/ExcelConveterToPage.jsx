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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
      const fileName = f.name.split("/").pop();
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
      const unique = merged.filter(
        (file, index, self) =>
          index ===
          self.findIndex((f) => f.name === file.name && f.size === file.size),
      );
      return unique;
    });
  };

  // ================= 파일 삭제 로직 =================
  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setFiles([]);
    setError("");

    const singleInput = document.getElementById("single-file");
    const folderInput = document.getElementById("folder-file");

    if (singleInput) singleInput.value = "";
    if (folderInput) folderInput.value = "";
  };

  // ================= 드래그 & 드롭 =================
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const items = e.dataTransfer.items;
    if (!items) return;

    const fileEntries = [];
    const traverseFileTree = (item) => {
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
              await traverseFileTree(entry);
            }
            resolve();
          });
        }
      });
    };

    const promises = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) promises.push(traverseFileTree(item));
    }
    await Promise.all(promises);
    if (fileEntries.length > 0) filterFiles(fileEntries);
  };

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    filterFiles(e.target.files);
    e.target.value = "";
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
      let csv = XLSX.utils.sheet_to_csv(worksheet, {
        forceQuotes: false,
      });

      // SYLK 오류 방지
      if (csv.startsWith('"ID"')) {
        csv = csv.replace(/^"ID"/, "ID");
      }

      const universalBOM = "\uFEFF";
      blob = new Blob([universalBOM + csv], {
        type: "text/csv;charset=utf-8;",
      });
      fileName = `${sheetName}.csv`;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
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
          borderRadius: 3,
          border: `2px dashed ${dragOver ? "#1976d2" : "#ccc"}`,
          backgroundColor: dragOver ? "#e3f2fd" : "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={2}>
          <input
            type="file"
            style={{ display: "none" }}
            id="single-file"
            multiple
            accept={acceptString}
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            onClick={() => document.getElementById("single-file").click()}
          >
            파일 업로드
          </Button>

          <input
            type="file"
            style={{ display: "none" }}
            id="folder-file"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFileChange}
          />
          <Button
            variant="outlined"
            onClick={() => document.getElementById("folder-file").click()}
          >
            폴더 업로드
          </Button>
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={convertOptions.json}
                onChange={(e) =>
                  setConvertOptions({
                    ...convertOptions,
                    json: e.target.checked,
                  })
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
                  setConvertOptions({
                    ...convertOptions,
                    csv: e.target.checked,
                  })
                }
              />
            }
            label="CSV"
          />
        </Stack>

        <Typography
          sx={{
            color: error ? "red" : "gray",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {error ||
            (files.length > 0
              ? `현재 ${files.length}개의 파일 대기 중`
              : "파일을 드래그하거나 업로드 버튼을 누르세요")}
        </Typography>

        {files.length > 0 && (
          <>
            <List
              sx={{
                width: "100%",
                bgcolor: "#f9f9f9",
                borderRadius: 2,
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              {files.map((f, idx) => (
                <ListItem
                  key={`${f.name}-${idx}`}
                  divider
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography noWrap sx={{ maxWidth: "60%", fontSize: 14 }}>
                    {f.name}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => handleConvert(f)}
                    >
                      변환
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFile(idx)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </ListItem>
              ))}
            </List>

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => files.forEach(handleConvert)}
              >
                전체 변환
              </Button>
              <Button variant="outlined" color="error" onClick={handleClearAll}>
                목록 비우기
              </Button>
            </Stack>
          </>
        )}
      </Card>
    </Stack>
  );
}
