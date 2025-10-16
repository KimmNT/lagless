import Button from "../Button/Button";
import styles from "./Dialog.module.scss";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  children,
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
        </div>
        <div className={styles.content}>{children}</div>
        <Button title="Close" onClick={onClose} isPrimary={true} />
      </div>
    </div>
  );
}
