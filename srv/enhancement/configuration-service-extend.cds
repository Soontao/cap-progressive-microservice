namespace cap.community.srv.enhancement.config;


using {cap.community.srv.config} from '../configuration-service';
using {cuid} from '@sap/cds/common';

extend service config.ConfigurationService with {

  entity Sample : cuid {}

}

annotate config.ConfigurationService with @custom.c.b;
