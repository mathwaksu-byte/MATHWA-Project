import { List, Datagrid, TextField, TopToolbar, CreateButton } from 'react-admin';

export const UniversityList = () => (
  <List actions={<TopToolbar><CreateButton /></TopToolbar>}>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Name" />
      <TextField source="slug" label="Slug" />
      <TextField source="duration_years" label="Duration (years)" />
    </Datagrid>
  </List>
);
