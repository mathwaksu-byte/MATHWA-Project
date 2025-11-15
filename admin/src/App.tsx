import { Admin, Resource } from 'react-admin';
import dataProvider from './dataProvider';
import { UniversityList } from './resources/universities';
import { UniversityCreate, UniversityEdit } from './resources/universities/UniversityForms';
import HeroVideoSettings from './resources/settings/HeroVideoSettings';
import FeesEditor from './resources/universities/FeesEditor';
import GalleryUploader from './resources/universities/GalleryUploader';
import DPUploader from './resources/universities/DPUploader';
import MyLayout from './ui/MyLayout';
import Dashboard from './ui/Dashboard';
import { LeadsList, LeadEdit, LeadShow } from './resources/leads';
import theme from './theme';

export default function App() {
  return (
    <Admin dataProvider={dataProvider} layout={MyLayout} dashboard={Dashboard} theme={theme}>
      <Resource name="universities" list={UniversityList} create={UniversityCreate} edit={UniversityEdit} />
      <Resource name="site-settings" list={HeroVideoSettings} />
      <Resource name="university-fees" list={FeesEditor} />
      <Resource name="university-gallery" list={GalleryUploader} />
      <Resource name="university-dp" list={DPUploader} />
      <Resource name="leads" list={LeadsList} edit={LeadEdit} show={LeadShow} />
    </Admin>
  );
}
