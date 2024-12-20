/**
 * Represents a common interface.
 * @interface
 * @name ICommon
 */
interface ICommon {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  isDisable?: boolean;
  isDelete?: boolean;
}
/**
 * Represents a file in the application.
 * @interface
 * @extends ICommon
 */
export interface IMFile extends ICommon {
  path: string;
  description?: string;
  is_active?: boolean;
}
/**
 * Represents an IMCode object.
 * @interface
 * @extends ICommon
 */
export interface IMCode extends ICommon {
  code?: string;
  type?: string;
  typeCode?: string;
  name?: string;
  description?: string;
  item?: IMCodeType;
  users?: IMUser[];
}

/**
 * Represents a code type in the application.
 * @interface
 * @extends ICommon
 */
export interface IMCodeType extends ICommon {
  name: string;
  code: string;
  isPrimary: boolean;
  items?: IMCode[];
}

/**
 * Represents the content of an item.
 * @interface
 * @extends ICommon
 */
export interface IMContent extends ICommon {
  name?: string;
  type?: string;
  typeCode?: string;
  imageUrl?: string;
  order?: number;
  item?: IContentType;
  languages?: {
    id: string;
    language?: string;
    name: string;
    description?: string;
    position?: string;
    content?: string;
    dataId?: string;
  }[];
}

/**
 * Represents the interface for a content type.
 * @interface
 * @extends ICommon
 */
export interface IContentType extends ICommon {
  name: string;
  code: string;
  isPrimary?: boolean;
  items?: IMContent[];
}

/**
 * Represents a parameter for a model.
 * @interface
 * @extends ICommon
 */
export interface IMParameter extends ICommon {
  name?: string;
  code?: string;
  contentVi?: string;
  contentEn?: string;
}

/**
 * Represents a post in the application.
 * @interface
 * @extends ICommon
 */
export interface IMPost extends ICommon {
  typeCode?: string;
  imageUrl?: string;
  type?: IMPostType;
  languages?: {
    language?: string;
    name: string;
    description?: string;
    slug: string;
    content?: string;
    postId?: string;
    post?: IMPost;
  }[];
}

/**
 * Represents the interface for a post type.
 * @interface
 * @extends ICommon
 */
export interface IMPostType extends ICommon {
  name: string;
  code: string;
  description: string;
  postTypeId: string;
  items?: IMPost[];
  children?: IMPostType[];
}

/**
 * Represents a member for a project.
 * @interface
 * @extends ICommon
 */
export interface IMUser extends ICommon {
  member_id?: number;
  member_code?: string;
  member_full_name?: string;
  email?: string;
  login_name?: string;
  join_date?: string;
  out_date?: string;
  role_model?: IMUserRole;
}
/**
 *
 * Represents the model for a Quality.
 */
export interface IManagement {
  manHours?: number;
  manHoursRVE?: number;
}

export interface IRequirementDefinition {
  manHours?: number;
  manHoursForReview?: number;
  manHoursForTranslation?: number;
  numberOfPages?: number;
  numberOfCommentsReviews?: number;
  numberOfQAs?: number;
  requirementDefinitionReviewCorrection?: number;
  requirementDefinitionReviewCorrectionRVE?: number;
  requirementDefinitionNumberPages?: number;
  requirementDefinitionNumberPagesRVE?: number;
  requirementDefinitionPointingOutRate?: number;
  requirementDefinitionPointingOutRateRVE?: number;
}

export interface IProgramming {
  manHours?: number;
  manHoursForReview?: number;
  manHoursForTranslation?: number;
  numberOfSteps?: number;
  numberOfCommentsReviews?: number;
  numberOfQAs?: number;
  programmingImplementationManHours?: number;
  programmingImplementationManHoursRVE?: number;
  programmingHourNumberSteps?: number;
  programmingHourNumberStepsRVE?: number;
  programmingReviewCorrection?: number;
  programmingReviewCorrectionRVE?: number;
  programmingNumberStepsPointingOutRate?: number;
  programmingNumberStepsPointingOutRateRVE?: number;
  programmingReviewManHoursIdentificationRate?: number;
  programmingReviewManHoursIdentificationRateRVE?: number;
}

export interface IBasicDesign {
  manHours?: number;
  manHoursForReview?: number;
  manHoursForTranslation?: number;
  numberOfPages?: number;
  numberOfCommentsReviews?: number;
  numberOfQAs?: number;
  basicDesignReviewCorrection?: number;
  basicDesignReviewCorrectionRVE?: number;
  basicDesignNumberPages?: number;
  basicDesignNumberPagesRVE?: number;
  basicDesignPointingOutRate?: number;
  basicDesignPointingOutRateRVE?: number;
  basicDesignTranslationManHour?: number;
  basicDesignTranslationManHourRVE?: number;
}

export interface IDetailDesign {
  manHours?: number;
  manHoursForReview?: number;
  manHoursForTranslation?: number;
  numberOfPages?: number;
  numberOfCommentsReviews?: number;
  numberOfQAs?: number;
  detailDesignReviewCorrection?: number;
  detailDesignReviewCorrectionRVE?: number;
  detailDesignNumberPages?: number;
  detailDesignNumberPagesRVE?: number;
  detailDesignPointingOutRate?: number;
  detailDesignPointingOutRateRVE?: number;
  detailDesignTranslationManHour?: number;
  detailDesignTranslationManHourRVE?: number;
}

export interface IUnitTest {
  manHours?: number;
  numberOfBug?: number;
  numberOfTestCase?: number;
  pointToNote?: number;
  unitTestBugHitRate?: number;
  unitTestBugHitRateRVE?: number;
  unitTestNumberStepsBugRate?: number;
  unitTestNumberStepsBugRateRVE?: number;
  unitTestManHoursIdentificationRate?: number;
  unitTestManHoursIdentificationRateRVE?: number;
}

export interface IIntegrationTest {
  manHours?: number;
  manHoursForReview?: number;
  manHoursForTranslation?: number;
  numberOfReviews?: number;
  numberOfTestCase?: number;
  integrationTestBugHitRate?: number;
  integrationTestBugHitRateRVE?: number;
  integrationTestNumberStepsBugRate?: number;
  integrationTestNumberStepsBugRateRVE?: number;
  integrationTestManHoursIdentificationRate?: number;
  integrationTestManHoursIdentificationRateRVE?: number;
}

export interface ISystemTest {
  manHours?: number;
  numberOfBug?: number;
  numberOfTestCase?: number;
  pointToNote?: number;
  systemTestBugHitRate?: number;
  systemTestBugHitRateRVE?: number;
  systemTestNumberStepsBugRate?: number;
  systemTestNumberStepsBugRateRVE?: number;
  systemTestManHoursIdentificationRate?: number;
  systemTestManHoursIdentificationRateRVE?: number;
}

export interface IQualityManagement {
  projectId?: number;
  projectName?: string;
  workContent?: string;
  management?: IManagement;
  requirementDefinition?: IRequirementDefinition;
  programming?: IProgramming;
  basicDesign?: IBasicDesign;
  detailDesign?: IDetailDesign;
  unitTest?: IUnitTest;
  integrationTest?: IIntegrationTest;
  systemTest?: ISystemTest;
}

/**
 * Represents the model for a user role.
 * @interface
 * @extends ICommon
 */
export interface IMUserRole {
  role_id?: number;
  role_code?: string;
  role_name?: string;
}

/**
 * Represents the data structure for resetting a password.
 * @interface
 * @extends ICommon
 */
export interface IResetPassword {
  password?: string;
  retypedPassword?: string;
  passwordOld?: string;
  email?: string;
  otp?: string;
}
