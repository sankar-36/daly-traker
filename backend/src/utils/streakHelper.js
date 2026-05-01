// ✅ Streak color — image-ல பாத்த logic
const getStreakColor = (percentage) => {
  if (percentage === 0)  return 'none';     // ⚪ 0%
  if (percentage <= 20)  return 'light';    // 🟢 20%
  if (percentage <= 40)  return 'low';      // 🟢 40%
  if (percentage <= 60)  return 'medium';   // 🟢 60%
  if (percentage <= 80)  return 'good';     // 🟢 80%
  return 'perfect';                         // 🟢 100%
};

// ✅ Task % + Course % → streak value
const calculateStreakValue = (taskPct, coursePct) => {
  const avg = (taskPct + coursePct) / 2;
  if (avg === 0)   return 0;
  if (avg <= 20)   return 20;
  if (avg <= 40)   return 40;
  if (avg <= 60)   return 60;
  if (avg <= 80)   return 80;
  return 100;
};

module.exports = { getStreakColor, calculateStreakValue };