import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#7c3aed", "#2563eb", "#16a34a", "#f59e0b"];

function AdminAnalyticsCharts() {

  // ---- Dummy analytics data (later replace with backend APIs)
  const growthData = [
    { month: "Aug", users: 50, cases: 20, matches: 10 },
    { month: "Sep", users: 120, cases: 60, matches: 30 },
    { month: "Oct", users: 200, cases: 130, matches: 80 },
    { month: "Nov", users: 350, cases: 220, matches: 150 },
    { month: "Dec", users: 500, cases: 340, matches: 260 },
  ];

//   const categoryData = [
//     { name: "Civil", value: 120 },
//     { name: "Criminal", value: 90 },
//     { name: "Family", value: 140 },
//     { name: "Property", value: 70 },
//     { name: "Labor", value: 50 },
//   ];

//   const roleData = [
//     { name: "Citizens", value: 400 },
//     { name: "Lawyers", value: 120 },
//     { name: "NGOs", value: 80 },
//     { name: "Admins", value: 5 },
//   ];

  return (
    <div className="space-y-6">

      {/* ---- LINE CHART ---- */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="text-sm font-semibold mb-3">📈 Platform Growth Trends</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month"/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="users" stroke="#7c3aed" />
            <Line type="monotone" dataKey="cases" stroke="#2563eb" />
            <Line type="monotone" dataKey="matches" stroke="#16a34a" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ---- BAR + PIE ROW ---- */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Bar Chart */}
        {/* <div className="bg-white border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">📊 Case Categories</h2>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="value" fill="#7c3aed"/>
            </BarChart>
          </ResponsiveContainer>
        </div> */}

        {/* Pie Chart */}
        {/* <div className="bg-white border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">🥧 Role Distribution</h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {roleData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </div> */}

      </div>
    </div>
  );
}

export default AdminAnalyticsCharts;
