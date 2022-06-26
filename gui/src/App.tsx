import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import { ellipse, triangle } from 'ionicons/icons';
import Employer from './pages/Employer';
import Employee from './pages/Employee';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();


const App: React.FC = () => (
  <IonApp>
    <IonReactHashRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/empolyer">
            <Employer />
          </Route>
          <Route exact path="/empolyee">
            <Employee />
          </Route>
          <Route exact path="/">
            <Redirect to="/empolyer" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="empolyer" href="/empolyer">
            <IonIcon icon={triangle} />
            <IonLabel>Employer</IonLabel>
          </IonTabButton>
          <IonTabButton tab="empolyee" href="/empolyee">
            <IonIcon icon={ellipse} />
            <IonLabel>Employee</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactHashRouter>
  </IonApp>
);

export default App;
