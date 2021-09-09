const now = new Date()
const startOfWeek = () =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1)
const endOfWeek = () =>
  new Date(now.getFullYear(), now.getMonth(), startOfWeek().getDate() + 7)

module.exports = {
  startOfWeek,
  endOfWeek,
}
