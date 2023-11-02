namespace cap.community.srv.enhancement.config;


using {cap.community.srv.config as c} from '../configuration-service';
using {cuid} from '@sap/cds/common';

extend service c.ConfigurationService with {

  entity Sample : cuid {}

}

annotate c.ConfigurationService with @custom.c.b;
