export const users = state => {
  let usersFiltered = []
  let finalobject = {}

  const keys = Object.keys(state.users)

  usersFiltered = keys
    .map(id => state.users[id])
    .sort((a, b) => (a.msgTimestamp < b.msgTimestamp ? 1 : -1))

  usersFiltered.map(element => {
    Object.keys(state.users).forEach(key => {
      if (state.users[key].email == element.email) {
        finalobject[key] = element
      }
    })
  })
  return finalobject
}
