import React, { useState } from "react";
import { Card, Button, Typography, List, ListItem, Stack } from "@mui/material";

export default function ExcelPage() {
  const allowedExtensions = ["xls", "xlsx"];
  const acceptString = allowedExtensions.map((ext) => `.${ext}`).join(",");

  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const filterFiles = (fileList) => {
    const filtered = Array.from(fileList).filter((f) => {
      const ext = f.name.split(".").pop().toLowerCase();
      return allowedExtensions.includes(ext);
    });

    if (filtered.length === 0) {
      setError(
        `엑셀 파일(.${allowedExtensions.join(",.")})만 업로드 가능합니다.`,
      );
      setFiles([]);
    } else {
      setError("");
      setFiles(filtered);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      filterFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    filterFiles(e.target.files);
  };

  return (
    <Stack alignItems="center" spacing={4}>
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
        <input
          type="file"
          style={{ display: "none" }}
          id="upload-button-file"
          webkitdirectory="true"
          multiple
          accept={acceptString}
          onChange={handleFileChange}
        />
        <label htmlFor="upload-button-file">
          <Button variant="contained" component="span">
            업로드
          </Button>
        </label>

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
                  ",.",
                )})을 드래그하거나 클릭하세요`}
        </Typography>

        {files.length > 0 && (
          <List sx={{ maxHeight: 150, overflow: "auto", width: "100%" }}>
            {files.map((f, idx) => (
              <ListItem key={idx} sx={{ py: 0.5 }}>
                {f.name}
              </ListItem>
            ))}
          </List>
        )}
      </Card>
    </Stack>
  );
}
