import { Create, Edit, SimpleForm, TextInput, NumberInput, BooleanInput, ArrayInput, SimpleFormIterator } from 'react-admin';

export const UniversityCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Name" required />
      <TextInput source="slug" label="Slug" required />
      <BooleanInput source="active" label="Active" />
      <NumberInput source="duration_years" label="Duration (years)" />
      <TextInput source="overview" label="Overview" multiline fullWidth />
      <ArrayInput source="accreditation" label="Accreditations">
        <SimpleFormIterator>
          <TextInput label="Item" />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="intake_months" label="Intake Months">
        <SimpleFormIterator>
          <TextInput label="Month" />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="eligibility" label="Eligibility" multiline fullWidth />
      <TextInput source="hostel_info" label="Hostel Info" multiline fullWidth />
      <TextInput source="hero_image_url" label="Hero Image URL" fullWidth />
      <TextInput source="logo_url" label="Logo URL" fullWidth />
    </SimpleForm>
  </Create>
);

export const UniversityEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Name" required />
      <TextInput source="slug" label="Slug" disabled />
      <BooleanInput source="active" label="Active" />
      <NumberInput source="duration_years" label="Duration (years)" />
      <TextInput source="overview" label="Overview" multiline fullWidth />
      <ArrayInput source="accreditation" label="Accreditations">
        <SimpleFormIterator>
          <TextInput label="Item" />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="intake_months" label="Intake Months">
        <SimpleFormIterator>
          <TextInput label="Month" />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="eligibility" label="Eligibility" multiline fullWidth />
      <TextInput source="hostel_info" label="Hostel Info" multiline fullWidth />
      <TextInput source="hero_image_url" label="Hero Image URL" fullWidth />
      <TextInput source="logo_url" label="Logo URL" fullWidth />
    </SimpleForm>
  </Edit>
);

