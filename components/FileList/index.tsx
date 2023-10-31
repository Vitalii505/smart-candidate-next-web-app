import React from "react";
import styles from "./FileList.module.scss";
import { FileItem } from "../../api/dto/files.dto";
import { FileCard } from "../../components/FileCard";
import Selecto from "react-selecto";

export type FileSelectType = "select" | "unselect";

interface FileListProps {
  items: FileItem[];
  onFileSelect: (id: string, type: FileSelectType) => void;
}

export const FileList: React.FC<FileListProps> = ({ items, onFileSelect }) => {
  return (
    <div className={styles.root}>
      {items.map((item) => (
        <div data-id={item.id} key={item.id} className="file">
          <FileCard filename={item.filename} originalName={item.originalName} />
        </div>
      ))}

      <Selecto
        className=".files"
        selectableTargets={[".file"]}
        selectByClick
        hitRate={10}
        selectFromInside
        toggleContinueSelect={["shift"]}
        continueSelect={false}
        onSelect={(e) => {
          e.added.forEach((el) => {
            el.classList.add("active");
            onFileSelect(el.dataset["id"], "select");
          });
          e.removed.forEach((el) => {
            el.classList.remove("active");
            onFileSelect(el.dataset["id"], "unselect");
          });
        }}
      />
    </div>
  );
};