function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "30px" }}>
      <h2>My Profile</h2>

      {user ? (
        <>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
        </>
      ) : (
        <p>Please login first.</p>
      )}
    </div>
  );
}

export default Profile;
