interface EmployeeCardProps {
  name: string;
  role: string;
  salary: string;
  avatar: string;
}

const EmployeeCard = ({ name, role, salary, avatar }: EmployeeCardProps) => {
  return (
    <div className="employee-card">
      <div className="employee-info">
        <img src={avatar} alt={name} className="employee-avatar" />
        <div className="employee-details">
          <h3>{name}</h3>
          <p>{role}</p>
        </div>
      </div>
      <div className="employee-salary">
        {salary}
      </div>
    </div>
  );
};

export default EmployeeCard;