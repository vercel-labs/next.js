import { Button, Card, CardContent, Typography, TextField, Autocomplete } from '@mui/material'
import { format } from 'date-fns'
import _ from 'lodash'

export default function Page5() {
  return (
    <Card>
      <CardContent>
        <Typography>{format(new Date(0), 'yyyy-MM-dd')}</Typography>
        <Autocomplete options={_.range(5).map(String)} renderInput={(p) => <TextField {...p} />} />
        <Button>page 5</Button>
      </CardContent>
    </Card>
  )
}
