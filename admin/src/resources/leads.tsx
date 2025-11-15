import { List, Datagrid, TextField, DateField, Edit, SimpleForm, TextInput, SelectInput, FunctionField, DateTimeInput, Show, SimpleShowLayout } from 'react-admin'
import { useEffect, useState } from 'react'
import { Chip, Stack, Link as MLink } from '@mui/material'

export function LeadsList() {
  const [metrics, setMetrics] = useState<any>(null)
  useEffect(() => {
    const base = (import.meta as any).env?.VITE_SERVER_BASE_URL || 'http://localhost:4000'
    fetch(`${base}/api/admin/leads/metrics`).then(r => r.json()).then(setMetrics).catch(() => {})
  }, [])
  const isImage = (u: string) => /\.(png|jpe?g|webp)$/i.test(u || '')
  const toWhatsApp = (phone?: string) => {
    const digits = (phone || '').replace(/[^0-9]/g, '')
    return digits ? `https://wa.me/${digits}` : 'https://wa.me/'
  }
  return (
    <div>
      {metrics && (
        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          <Chip label={`New: ${metrics.byStatus?.new || 0}`} color="primary" variant="outlined" />
          <Chip label={`Contacted: ${metrics.byStatus?.contacted || 0}`} color="success" variant="outlined" />
          <Chip label={`Closed: ${metrics.byStatus?.closed || 0}`} color="default" variant="outlined" />
        </Stack>
      )}
      <List filters={[
        <TextInput key="q" source="q" label="Search" alwaysOn />,
        <SelectInput key="status" source="status" label="Status" choices={[{ id: 'new', name: 'new' }, { id: 'contacted', name: 'contacted' }, { id: 'closed', name: 'closed' }]} />,
        <TextInput key="preferred_university_slug" source="preferred_university_slug" label="University" />,
      ]}>
        <Datagrid rowClick="edit">
          <DateField source="created_at" />
          <TextField source="name" />
          <TextField source="phone" />
          <TextField source="email" />
          <TextField source="city" />
          <TextField source="preferred_university_slug" />
          <TextField source="preferred_year" />
          <FunctionField label="Status" render={record => <Chip label={record?.status || 'new'} size="small" color={record?.status === 'contacted' ? 'success' : record?.status === 'closed' ? 'default' : 'primary'} />} />
          <FunctionField label="Priority" render={record => <Chip label={record?.priority || 'normal'} size="small" color={record?.priority === 'high' ? 'error' : record?.priority === 'low' ? 'default' : 'warning'} variant="outlined" />} />
          <FunctionField label="Marksheet" render={record => {
            const u = record?.marksheet_url
            if (!u) return ''
            return isImage(u)
              ? <img src={u} alt="marksheet" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
              : <MLink href={u} target="_blank" rel="noreferrer">Open</MLink>
          }} />
          <FunctionField label="Contact" render={record => (
            <Stack direction="row" spacing={1}>
              <MLink href={`tel:${record?.phone || ''}`}>Call</MLink>
              <MLink href={toWhatsApp(record?.phone)} target="_blank" rel="noreferrer">WhatsApp</MLink>
              {record?.email && <MLink href={`mailto:${record.email}`}>Email</MLink>}
            </Stack>
          )} />
        </Datagrid>
      </List>
    </div>
  )
}

export function LeadEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextField source="id" />
        <DateField source="created_at" />
        <TextField source="name" />
        <TextField source="phone" />
        <TextField source="email" />
        <TextField source="city" />
        <TextField source="preferred_university_slug" />
        <TextField source="preferred_year" />
        <SelectInput source="status" choices={[{ id: 'new', name: 'new' }, { id: 'contacted', name: 'contacted' }, { id: 'closed', name: 'closed' }]} />
        <SelectInput source="priority" choices={[{ id: 'low', name: 'low' }, { id: 'normal', name: 'normal' }, { id: 'high', name: 'high' }]} />
        <TextInput source="assigned_admin_id" />
        <TextInput source="notes" multiline />
        <DateTimeInput source="last_contacted_at" />
        <DateTimeInput source="next_action_at" />
        <FunctionField label="Marksheet Preview" render={record => {
          const u = record?.marksheet_url
          if (!u) return ''
          const isImg = /\.(png|jpe?g|webp)$/i.test(u)
          return isImg ? (
            <img src={u} alt="marksheet" style={{ maxWidth: '100%', borderRadius: 8 }} />
          ) : (
            <MLink href={u} target="_blank" rel="noreferrer">Open Marksheet</MLink>
          )
        }} />
      </SimpleForm>
    </Edit>
  )
}

export function LeadShow() {
  return (
    <Show>
      <SimpleShowLayout>
        <DateField source="created_at" />
        <TextField source="name" />
        <TextField source="phone" />
        <TextField source="email" />
        <TextField source="city" />
        <TextField source="preferred_university_slug" />
        <TextField source="preferred_year" />
        <TextField source="status" />
        <TextField source="priority" />
        <FunctionField label="Marksheet" render={record => record?.marksheet_url ? <MLink href={record.marksheet_url} target="_blank" rel="noreferrer">Open</MLink> : ''} />
      </SimpleShowLayout>
    </Show>
  )
}
