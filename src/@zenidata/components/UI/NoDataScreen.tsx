export const NoDataScreen = ({ ...rest }) => {
  return (
    <div className="iz_position-relative">
      <div
        style={{
          // width: "100%",
          minHeight: "50vh",
          margin: "auto",
          // border: "4px solid red",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <img
          alt=""
          src="/assets/img/amico.png"
          style={{ filter: "grayscale(100%)", opacity: 0.3 }}
        />
        <h3>Aucune donnée trouvée</h3>
      </div>
    </div>
  );
};

export default NoDataScreen;
