function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  return (
    <div className="page">
      <div className="profile-card">
        {user ? (
          <>
            <div className="avatar">{firstLetter}</div>

            <h2>{user.name}</h2>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> Student</p>
          </>
        ) : (
          <p>Please login first.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
