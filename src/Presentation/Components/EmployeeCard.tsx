
// src/Presentation/Components/EmployeeCard.tsx
interface EmployeeCardProps {
  name: string;
  role: string;
  salary: string;
  avatar: string;
}

const EmployeeCard = ({ name, role, salary, avatar }: EmployeeCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <div className="font-bold text-gray-900">
        {salary}
      </div>
    </div>
  );
};

export default EmployeeCard;