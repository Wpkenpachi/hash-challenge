import { api } from './api'

api.listen(process.env.PORT, () => {
  console.log('Api running at', process.env.PORT)
})