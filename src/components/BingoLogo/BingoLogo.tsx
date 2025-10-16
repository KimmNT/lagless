import style from "./BingoLogo.module.scss";

export default function BingoLogo() {
  return (
    <div className={style.BingoLogo}>
      <div className={style.Item}>B</div>
      <div className={style.Item}>I</div>
      <div className={style.Item}>N</div>
      <div className={style.Item}>G</div>
      <div className={style.Item}>O</div>
    </div>
  );
}
