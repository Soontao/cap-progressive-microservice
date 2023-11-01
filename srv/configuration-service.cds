namespace cap.community.srv.config;

using {cap.community.db.config} from '../db/configuration';

service ConfigurationService {
  entity BusinessPartnerTypes as projection on config.BusinessPartnerType;
}
