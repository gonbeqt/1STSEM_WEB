import './profile.css'
interface MenuItem {
  icon: string;
  title: string;
  value?: string;
}

const user = {
  name: "John Doe",
  title: "Financial Manager",
  image: "path/to/profile-image.jpg"
};

const menuItems: MenuItem[] = [
  { icon: "wallet", title: "Wallet" },
  { icon: "document", title: "Compliance" },
  { icon: "currency", title: "Currency", value: "ETH/USD" },
  { icon: "shield", title: "Security" },
  { icon: "help", title: "Help" }
];

const Profile = () => {
  return (
    <div className="sidebar">
      <div className="user-profile">
        <img src={user.image} alt={user.name} className="profile-image" />
        <div className="user-info">
          <h2>{user.name}</h2>
          <span>{user.title}</span>
        </div>
      </div>
      <nav className="menu">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item">
            <i className={`icon ${item.icon}`}></i>
            <span className="item-title">{item.title}</span>
            {item.value && <span className="item-value">{item.value}</span>}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Profile;