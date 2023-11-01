namespace cap.community.srv.resource;


using {cap.community.db.resource} from '../db/resource';


service ResourceService {
  entity AbstractResources as projection on resource.AbstractResource;
  entity Artifacts         as projection on resource.Artifact;
}
