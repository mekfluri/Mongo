
import Comments from "./Components/Comments";
import data from "./data.json";

function KomentApp() {
  const currentUser = data.currentUser;
  console.log(currentUser)

  return (
    <div className="KomentApp">
      <Comments currentUser={currentUser} />

    </div>
  );
}

export default KomentApp;
