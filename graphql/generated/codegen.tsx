import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  DateTime: any;
};


export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  budget?: Maybe<Budget>;
  transactions: Array<Transactions>;
  budgets: Array<Budget>;
  stacks: Array<Stacks>;
};


export type QueryUserArgs = {
  where: UserWhereUniqueInput;
};


export type QueryBudgetArgs = {
  where: BudgetWhereUniqueInput;
};


export type QueryTransactionsArgs = {
  where?: Maybe<QueryTransactionsWhereInput>;
  orderBy?: Maybe<Array<QueryTransactionsOrderByInput>>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<TransactionsWhereUniqueInput>;
  after?: Maybe<TransactionsWhereUniqueInput>;
};


export type QueryBudgetsArgs = {
  where?: Maybe<QueryBudgetsWhereInput>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<BudgetWhereUniqueInput>;
  after?: Maybe<BudgetWhereUniqueInput>;
};


export type QueryStacksArgs = {
  where?: Maybe<QueryStacksWhereInput>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<StacksWhereUniqueInput>;
  after?: Maybe<StacksWhereUniqueInput>;
};

export type Budget = {
  __typename?: 'budget';
  id: Scalars['Int'];
  toBeBudgeted?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
  userId: Scalars['Int'];
  stacks: Array<Stacks>;
};


export type BudgetStacksArgs = {
  orderBy?: Maybe<Array<StacksOrderByInput>>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<StacksWhereUniqueInput>;
  after?: Maybe<StacksWhereUniqueInput>;
};

export type Transactions = {
  __typename?: 'transactions';
  amount: Scalars['Float'];
  description: Scalars['String'];
  id: Scalars['Int'];
  stack: Scalars['String'];
  type: Scalars['String'];
  userId: Scalars['Int'];
  date: Scalars['DateTime'];
};

export type Stacks = {
  __typename?: 'stacks';
  id: Scalars['Int'];
  label: Scalars['String'];
  amount: Scalars['Float'];
  budgetId: Scalars['Int'];
  created_at: Scalars['DateTime'];
};

export type User = {
  __typename?: 'user';
  id: Scalars['Int'];
  email: Scalars['String'];
  budget?: Maybe<Budget>;
  transactions: Array<Transactions>;
};


export type UserTransactionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<TransactionsWhereUniqueInput>;
  after?: Maybe<TransactionsWhereUniqueInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  uploadFile?: Maybe<UploadFile>;
  createOneuser: User;
  deleteOnestacks?: Maybe<Stacks>;
  deleteManytransactions: BatchPayload;
  createOnebudget: Budget;
  updateOnebudget?: Maybe<Budget>;
  updateOnestacks?: Maybe<Stacks>;
  createOnestacks: Stacks;
  createOnetransactions: Transactions;
  updateOnetransactions?: Maybe<Transactions>;
};


export type MutationUploadFileArgs = {
  file?: Maybe<Scalars['Upload']>;
};


export type MutationCreateOneuserArgs = {
  data: UserCreateInput;
};


export type MutationDeleteOnestacksArgs = {
  where: StacksWhereUniqueInput;
};


export type MutationDeleteManytransactionsArgs = {
  where?: Maybe<TransactionsWhereInput>;
};


export type MutationCreateOnebudgetArgs = {
  data: BudgetCreateInput;
};


export type MutationUpdateOnebudgetArgs = {
  data: BudgetUpdateInput;
  where: BudgetWhereUniqueInput;
};


export type MutationUpdateOnestacksArgs = {
  data: StacksUpdateInput;
  where: StacksWhereUniqueInput;
};


export type MutationCreateOnestacksArgs = {
  data: StacksCreateInput;
};


export type MutationCreateOnetransactionsArgs = {
  data: TransactionsCreateInput;
};


export type MutationUpdateOnetransactionsArgs = {
  data: TransactionsUpdateInput;
  where: TransactionsWhereUniqueInput;
};

export type UploadFile = {
  __typename?: 'UploadFile';
  uri?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
};

export type UserWhereUniqueInput = {
  id?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
};

export type BudgetWhereUniqueInput = {
  id?: Maybe<Scalars['Int']>;
};

export type QueryTransactionsWhereInput = {
  userId?: Maybe<IntFilter>;
  user?: Maybe<UserWhereInput>;
};

export type QueryTransactionsOrderByInput = {
  date?: Maybe<SortOrder>;
};

export type TransactionsWhereUniqueInput = {
  id?: Maybe<Scalars['Int']>;
};

export type QueryBudgetsWhereInput = {
  userId?: Maybe<IntFilter>;
  user?: Maybe<UserWhereInput>;
};

export type QueryStacksWhereInput = {
  id?: Maybe<IntFilter>;
};

export type StacksWhereUniqueInput = {
  id?: Maybe<Scalars['Int']>;
  budgetId_label_idx?: Maybe<BudgetId_Label_IdxCompoundUniqueInput>;
};

export type StacksOrderByInput = {
  id?: Maybe<SortOrder>;
  budgetId?: Maybe<SortOrder>;
  label?: Maybe<SortOrder>;
  amount?: Maybe<SortOrder>;
  created_at?: Maybe<SortOrder>;
};


export type UserCreateInput = {
  name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  emailVerified?: Maybe<Scalars['DateTime']>;
  image?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  transactions?: Maybe<TransactionsCreateManyWithoutUserInput>;
  budget?: Maybe<BudgetCreateOneWithoutUserInput>;
};

export type BatchPayload = {
  __typename?: 'BatchPayload';
  count: Scalars['Int'];
};

export type TransactionsWhereInput = {
  AND?: Maybe<Array<TransactionsWhereInput>>;
  OR?: Maybe<Array<TransactionsWhereInput>>;
  NOT?: Maybe<Array<TransactionsWhereInput>>;
  id?: Maybe<IntFilter>;
  description?: Maybe<StringFilter>;
  stack?: Maybe<StringFilter>;
  amount?: Maybe<FloatFilter>;
  type?: Maybe<StringFilter>;
  userId?: Maybe<IntFilter>;
  date?: Maybe<DateTimeFilter>;
  user?: Maybe<UserWhereInput>;
};

export type BudgetCreateInput = {
  total?: Maybe<Scalars['Float']>;
  toBeBudgeted?: Maybe<Scalars['Float']>;
  user: UserCreateOneWithoutBudgetInput;
  stacks?: Maybe<StacksCreateManyWithoutBudgetInput>;
};

export type BudgetUpdateInput = {
  total?: Maybe<NullableFloatFieldUpdateOperationsInput>;
  toBeBudgeted?: Maybe<NullableFloatFieldUpdateOperationsInput>;
  user?: Maybe<UserUpdateOneRequiredWithoutBudgetInput>;
  stacks?: Maybe<StacksUpdateManyWithoutBudgetInput>;
};

export type StacksUpdateInput = {
  label?: Maybe<StringFieldUpdateOperationsInput>;
  amount?: Maybe<FloatFieldUpdateOperationsInput>;
  created_at?: Maybe<DateTimeFieldUpdateOperationsInput>;
  budget?: Maybe<BudgetUpdateOneRequiredWithoutStacksInput>;
};

export type StacksCreateInput = {
  label: Scalars['String'];
  amount?: Maybe<Scalars['Float']>;
  created_at?: Maybe<Scalars['DateTime']>;
  budget: BudgetCreateOneWithoutStacksInput;
};

export type TransactionsCreateInput = {
  description: Scalars['String'];
  stack: Scalars['String'];
  amount: Scalars['Float'];
  type: Scalars['String'];
  date: Scalars['DateTime'];
  user: UserCreateOneWithoutTransactionsInput;
};

export type TransactionsUpdateInput = {
  description?: Maybe<StringFieldUpdateOperationsInput>;
  stack?: Maybe<StringFieldUpdateOperationsInput>;
  amount?: Maybe<FloatFieldUpdateOperationsInput>;
  type?: Maybe<StringFieldUpdateOperationsInput>;
  date?: Maybe<DateTimeFieldUpdateOperationsInput>;
  user?: Maybe<UserUpdateOneRequiredWithoutTransactionsInput>;
};

export type IntFilter = {
  equals?: Maybe<Scalars['Int']>;
  in?: Maybe<Array<Scalars['Int']>>;
  notIn?: Maybe<Array<Scalars['Int']>>;
  lt?: Maybe<Scalars['Int']>;
  lte?: Maybe<Scalars['Int']>;
  gt?: Maybe<Scalars['Int']>;
  gte?: Maybe<Scalars['Int']>;
  not?: Maybe<NestedIntFilter>;
};

export type UserWhereInput = {
  AND?: Maybe<Array<UserWhereInput>>;
  OR?: Maybe<Array<UserWhereInput>>;
  NOT?: Maybe<Array<UserWhereInput>>;
  id?: Maybe<IntFilter>;
  name?: Maybe<StringNullableFilter>;
  email?: Maybe<StringFilter>;
  emailVerified?: Maybe<DateTimeNullableFilter>;
  image?: Maybe<StringNullableFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  transactions?: Maybe<TransactionsListRelationFilter>;
  budget?: Maybe<BudgetWhereInput>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type BudgetId_Label_IdxCompoundUniqueInput = {
  budgetId: Scalars['Int'];
  label: Scalars['String'];
};

export type TransactionsCreateManyWithoutUserInput = {
  create?: Maybe<Array<TransactionsCreateWithoutUserInput>>;
  connect?: Maybe<Array<TransactionsWhereUniqueInput>>;
  connectOrCreate?: Maybe<Array<TransactionsCreateOrConnectWithoutuserInput>>;
};

export type BudgetCreateOneWithoutUserInput = {
  create?: Maybe<BudgetCreateWithoutUserInput>;
  connect?: Maybe<BudgetWhereUniqueInput>;
  connectOrCreate?: Maybe<BudgetCreateOrConnectWithoutuserInput>;
};

export type StringFilter = {
  equals?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Scalars['String']>>;
  notIn?: Maybe<Array<Scalars['String']>>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  contains?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  mode?: Maybe<QueryMode>;
  not?: Maybe<NestedStringFilter>;
};

export type FloatFilter = {
  equals?: Maybe<Scalars['Float']>;
  in?: Maybe<Array<Scalars['Float']>>;
  notIn?: Maybe<Array<Scalars['Float']>>;
  lt?: Maybe<Scalars['Float']>;
  lte?: Maybe<Scalars['Float']>;
  gt?: Maybe<Scalars['Float']>;
  gte?: Maybe<Scalars['Float']>;
  not?: Maybe<NestedFloatFilter>;
};

export type DateTimeFilter = {
  equals?: Maybe<Scalars['DateTime']>;
  in?: Maybe<Array<Scalars['DateTime']>>;
  notIn?: Maybe<Array<Scalars['DateTime']>>;
  lt?: Maybe<Scalars['DateTime']>;
  lte?: Maybe<Scalars['DateTime']>;
  gt?: Maybe<Scalars['DateTime']>;
  gte?: Maybe<Scalars['DateTime']>;
  not?: Maybe<NestedDateTimeFilter>;
};

export type UserCreateOneWithoutBudgetInput = {
  create?: Maybe<UserCreateWithoutBudgetInput>;
  connect?: Maybe<UserWhereUniqueInput>;
  connectOrCreate?: Maybe<UserCreateOrConnectWithoutbudgetInput>;
};

export type StacksCreateManyWithoutBudgetInput = {
  create?: Maybe<Array<StacksCreateWithoutBudgetInput>>;
  connect?: Maybe<Array<StacksWhereUniqueInput>>;
  connectOrCreate?: Maybe<Array<StacksCreateOrConnectWithoutbudgetInput>>;
};

export type NullableFloatFieldUpdateOperationsInput = {
  set?: Maybe<Scalars['Float']>;
  increment?: Maybe<Scalars['Float']>;
  decrement?: Maybe<Scalars['Float']>;
  multiply?: Maybe<Scalars['Float']>;
  divide?: Maybe<Scalars['Float']>;
};

export type UserUpdateOneRequiredWithoutBudgetInput = {
  create?: Maybe<UserCreateWithoutBudgetInput>;
  connect?: Maybe<UserWhereUniqueInput>;
  update?: Maybe<UserUpdateWithoutBudgetInput>;
  upsert?: Maybe<UserUpsertWithoutBudgetInput>;
  connectOrCreate?: Maybe<UserCreateOrConnectWithoutbudgetInput>;
};

export type StacksUpdateManyWithoutBudgetInput = {
  create?: Maybe<Array<StacksCreateWithoutBudgetInput>>;
  connect?: Maybe<Array<StacksWhereUniqueInput>>;
  set?: Maybe<Array<StacksWhereUniqueInput>>;
  disconnect?: Maybe<Array<StacksWhereUniqueInput>>;
  delete?: Maybe<Array<StacksWhereUniqueInput>>;
  update?: Maybe<Array<StacksUpdateWithWhereUniqueWithoutBudgetInput>>;
  updateMany?: Maybe<Array<StacksUpdateManyWithWhereWithoutBudgetInput>>;
  deleteMany?: Maybe<Array<StacksScalarWhereInput>>;
  upsert?: Maybe<Array<StacksUpsertWithWhereUniqueWithoutBudgetInput>>;
  connectOrCreate?: Maybe<Array<StacksCreateOrConnectWithoutbudgetInput>>;
};

export type StringFieldUpdateOperationsInput = {
  set?: Maybe<Scalars['String']>;
};

export type FloatFieldUpdateOperationsInput = {
  set?: Maybe<Scalars['Float']>;
  increment?: Maybe<Scalars['Float']>;
  decrement?: Maybe<Scalars['Float']>;
  multiply?: Maybe<Scalars['Float']>;
  divide?: Maybe<Scalars['Float']>;
};

export type DateTimeFieldUpdateOperationsInput = {
  set?: Maybe<Scalars['DateTime']>;
};

export type BudgetUpdateOneRequiredWithoutStacksInput = {
  create?: Maybe<BudgetCreateWithoutStacksInput>;
  connect?: Maybe<BudgetWhereUniqueInput>;
  update?: Maybe<BudgetUpdateWithoutStacksInput>;
  upsert?: Maybe<BudgetUpsertWithoutStacksInput>;
  connectOrCreate?: Maybe<BudgetCreateOrConnectWithoutstacksInput>;
};

export type BudgetCreateOneWithoutStacksInput = {
  create?: Maybe<BudgetCreateWithoutStacksInput>;
  connect?: Maybe<BudgetWhereUniqueInput>;
  connectOrCreate?: Maybe<BudgetCreateOrConnectWithoutstacksInput>;
};

export type UserCreateOneWithoutTransactionsInput = {
  create?: Maybe<UserCreateWithoutTransactionsInput>;
  connect?: Maybe<UserWhereUniqueInput>;
  connectOrCreate?: Maybe<UserCreateOrConnectWithouttransactionsInput>;
};

export type UserUpdateOneRequiredWithoutTransactionsInput = {
  create?: Maybe<UserCreateWithoutTransactionsInput>;
  connect?: Maybe<UserWhereUniqueInput>;
  update?: Maybe<UserUpdateWithoutTransactionsInput>;
  upsert?: Maybe<UserUpsertWithoutTransactionsInput>;
  connectOrCreate?: Maybe<UserCreateOrConnectWithouttransactionsInput>;
};

export type NestedIntFilter = {
  equals?: Maybe<Scalars['Int']>;
  in?: Maybe<Array<Scalars['Int']>>;
  notIn?: Maybe<Array<Scalars['Int']>>;
  lt?: Maybe<Scalars['Int']>;
  lte?: Maybe<Scalars['Int']>;
  gt?: Maybe<Scalars['Int']>;
  gte?: Maybe<Scalars['Int']>;
  not?: Maybe<NestedIntFilter>;
};

export type StringNullableFilter = {
  equals?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Scalars['String']>>;
  notIn?: Maybe<Array<Scalars['String']>>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  contains?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  mode?: Maybe<QueryMode>;
  not?: Maybe<NestedStringNullableFilter>;
};

export type DateTimeNullableFilter = {
  equals?: Maybe<Scalars['DateTime']>;
  in?: Maybe<Array<Scalars['DateTime']>>;
  notIn?: Maybe<Array<Scalars['DateTime']>>;
  lt?: Maybe<Scalars['DateTime']>;
  lte?: Maybe<Scalars['DateTime']>;
  gt?: Maybe<Scalars['DateTime']>;
  gte?: Maybe<Scalars['DateTime']>;
  not?: Maybe<NestedDateTimeNullableFilter>;
};

export type TransactionsListRelationFilter = {
  every?: Maybe<TransactionsWhereInput>;
  some?: Maybe<TransactionsWhereInput>;
  none?: Maybe<TransactionsWhereInput>;
};

export type BudgetWhereInput = {
  AND?: Maybe<Array<BudgetWhereInput>>;
  OR?: Maybe<Array<BudgetWhereInput>>;
  NOT?: Maybe<Array<BudgetWhereInput>>;
  id?: Maybe<IntFilter>;
  total?: Maybe<FloatNullableFilter>;
  toBeBudgeted?: Maybe<FloatNullableFilter>;
  userId?: Maybe<IntFilter>;
  user?: Maybe<UserWhereInput>;
  stacks?: Maybe<StacksListRelationFilter>;
};

export type TransactionsCreateWithoutUserInput = {
  description: Scalars['String'];
  stack: Scalars['String'];
  amount: Scalars['Float'];
  type: Scalars['String'];
  date: Scalars['DateTime'];
};

export type TransactionsCreateOrConnectWithoutuserInput = {
  where: TransactionsWhereUniqueInput;
  create: TransactionsCreateWithoutUserInput;
};

export type BudgetCreateWithoutUserInput = {
  total?: Maybe<Scalars['Float']>;
  toBeBudgeted?: Maybe<Scalars['Float']>;
  stacks?: Maybe<StacksCreateManyWithoutBudgetInput>;
};

export type BudgetCreateOrConnectWithoutuserInput = {
  where: BudgetWhereUniqueInput;
  create: BudgetCreateWithoutUserInput;
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type NestedStringFilter = {
  equals?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Scalars['String']>>;
  notIn?: Maybe<Array<Scalars['String']>>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  contains?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  not?: Maybe<NestedStringFilter>;
};

export type NestedFloatFilter = {
  equals?: Maybe<Scalars['Float']>;
  in?: Maybe<Array<Scalars['Float']>>;
  notIn?: Maybe<Array<Scalars['Float']>>;
  lt?: Maybe<Scalars['Float']>;
  lte?: Maybe<Scalars['Float']>;
  gt?: Maybe<Scalars['Float']>;
  gte?: Maybe<Scalars['Float']>;
  not?: Maybe<NestedFloatFilter>;
};

export type NestedDateTimeFilter = {
  equals?: Maybe<Scalars['DateTime']>;
  in?: Maybe<Array<Scalars['DateTime']>>;
  notIn?: Maybe<Array<Scalars['DateTime']>>;
  lt?: Maybe<Scalars['DateTime']>;
  lte?: Maybe<Scalars['DateTime']>;
  gt?: Maybe<Scalars['DateTime']>;
  gte?: Maybe<Scalars['DateTime']>;
  not?: Maybe<NestedDateTimeFilter>;
};

export type UserCreateWithoutBudgetInput = {
  name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  emailVerified?: Maybe<Scalars['DateTime']>;
  image?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  transactions?: Maybe<TransactionsCreateManyWithoutUserInput>;
};

export type UserCreateOrConnectWithoutbudgetInput = {
  where: UserWhereUniqueInput;
  create: UserCreateWithoutBudgetInput;
};

export type StacksCreateWithoutBudgetInput = {
  label: Scalars['String'];
  amount?: Maybe<Scalars['Float']>;
  created_at?: Maybe<Scalars['DateTime']>;
};

export type StacksCreateOrConnectWithoutbudgetInput = {
  where: StacksWhereUniqueInput;
  create: StacksCreateWithoutBudgetInput;
};

export type UserUpdateWithoutBudgetInput = {
  name?: Maybe<NullableStringFieldUpdateOperationsInput>;
  email?: Maybe<StringFieldUpdateOperationsInput>;
  emailVerified?: Maybe<NullableDateTimeFieldUpdateOperationsInput>;
  image?: Maybe<NullableStringFieldUpdateOperationsInput>;
  createdAt?: Maybe<DateTimeFieldUpdateOperationsInput>;
  updatedAt?: Maybe<DateTimeFieldUpdateOperationsInput>;
  transactions?: Maybe<TransactionsUpdateManyWithoutUserInput>;
};

export type UserUpsertWithoutBudgetInput = {
  update: UserUpdateWithoutBudgetInput;
  create: UserCreateWithoutBudgetInput;
};

export type StacksUpdateWithWhereUniqueWithoutBudgetInput = {
  where: StacksWhereUniqueInput;
  data: StacksUpdateWithoutBudgetInput;
};

export type StacksUpdateManyWithWhereWithoutBudgetInput = {
  where: StacksScalarWhereInput;
  data: StacksUpdateManyMutationInput;
};

export type StacksScalarWhereInput = {
  AND?: Maybe<Array<StacksScalarWhereInput>>;
  OR?: Maybe<Array<StacksScalarWhereInput>>;
  NOT?: Maybe<Array<StacksScalarWhereInput>>;
  id?: Maybe<IntFilter>;
  budgetId?: Maybe<IntFilter>;
  label?: Maybe<StringFilter>;
  amount?: Maybe<FloatFilter>;
  created_at?: Maybe<DateTimeFilter>;
};

export type StacksUpsertWithWhereUniqueWithoutBudgetInput = {
  where: StacksWhereUniqueInput;
  update: StacksUpdateWithoutBudgetInput;
  create: StacksCreateWithoutBudgetInput;
};

export type BudgetCreateWithoutStacksInput = {
  total?: Maybe<Scalars['Float']>;
  toBeBudgeted?: Maybe<Scalars['Float']>;
  user: UserCreateOneWithoutBudgetInput;
};

export type BudgetUpdateWithoutStacksInput = {
  total?: Maybe<NullableFloatFieldUpdateOperationsInput>;
  toBeBudgeted?: Maybe<NullableFloatFieldUpdateOperationsInput>;
  user?: Maybe<UserUpdateOneRequiredWithoutBudgetInput>;
};

export type BudgetUpsertWithoutStacksInput = {
  update: BudgetUpdateWithoutStacksInput;
  create: BudgetCreateWithoutStacksInput;
};

export type BudgetCreateOrConnectWithoutstacksInput = {
  where: BudgetWhereUniqueInput;
  create: BudgetCreateWithoutStacksInput;
};

export type UserCreateWithoutTransactionsInput = {
  name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  emailVerified?: Maybe<Scalars['DateTime']>;
  image?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  budget?: Maybe<BudgetCreateOneWithoutUserInput>;
};

export type UserCreateOrConnectWithouttransactionsInput = {
  where: UserWhereUniqueInput;
  create: UserCreateWithoutTransactionsInput;
};

export type UserUpdateWithoutTransactionsInput = {
  name?: Maybe<NullableStringFieldUpdateOperationsInput>;
  email?: Maybe<StringFieldUpdateOperationsInput>;
  emailVerified?: Maybe<NullableDateTimeFieldUpdateOperationsInput>;
  image?: Maybe<NullableStringFieldUpdateOperationsInput>;
  createdAt?: Maybe<DateTimeFieldUpdateOperationsInput>;
  updatedAt?: Maybe<DateTimeFieldUpdateOperationsInput>;
  budget?: Maybe<BudgetUpdateOneWithoutUserInput>;
};

export type UserUpsertWithoutTransactionsInput = {
  update: UserUpdateWithoutTransactionsInput;
  create: UserCreateWithoutTransactionsInput;
};

export type NestedStringNullableFilter = {
  equals?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Scalars['String']>>;
  notIn?: Maybe<Array<Scalars['String']>>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  contains?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  not?: Maybe<NestedStringNullableFilter>;
};

export type NestedDateTimeNullableFilter = {
  equals?: Maybe<Scalars['DateTime']>;
  in?: Maybe<Array<Scalars['DateTime']>>;
  notIn?: Maybe<Array<Scalars['DateTime']>>;
  lt?: Maybe<Scalars['DateTime']>;
  lte?: Maybe<Scalars['DateTime']>;
  gt?: Maybe<Scalars['DateTime']>;
  gte?: Maybe<Scalars['DateTime']>;
  not?: Maybe<NestedDateTimeNullableFilter>;
};

export type FloatNullableFilter = {
  equals?: Maybe<Scalars['Float']>;
  in?: Maybe<Array<Scalars['Float']>>;
  notIn?: Maybe<Array<Scalars['Float']>>;
  lt?: Maybe<Scalars['Float']>;
  lte?: Maybe<Scalars['Float']>;
  gt?: Maybe<Scalars['Float']>;
  gte?: Maybe<Scalars['Float']>;
  not?: Maybe<NestedFloatNullableFilter>;
};

export type StacksListRelationFilter = {
  every?: Maybe<StacksWhereInput>;
  some?: Maybe<StacksWhereInput>;
  none?: Maybe<StacksWhereInput>;
};

export type NullableStringFieldUpdateOperationsInput = {
  set?: Maybe<Scalars['String']>;
};

export type NullableDateTimeFieldUpdateOperationsInput = {
  set?: Maybe<Scalars['DateTime']>;
};

export type TransactionsUpdateManyWithoutUserInput = {
  create?: Maybe<Array<TransactionsCreateWithoutUserInput>>;
  connect?: Maybe<Array<TransactionsWhereUniqueInput>>;
  set?: Maybe<Array<TransactionsWhereUniqueInput>>;
  disconnect?: Maybe<Array<TransactionsWhereUniqueInput>>;
  delete?: Maybe<Array<TransactionsWhereUniqueInput>>;
  update?: Maybe<Array<TransactionsUpdateWithWhereUniqueWithoutUserInput>>;
  updateMany?: Maybe<Array<TransactionsUpdateManyWithWhereWithoutUserInput>>;
  deleteMany?: Maybe<Array<TransactionsScalarWhereInput>>;
  upsert?: Maybe<Array<TransactionsUpsertWithWhereUniqueWithoutUserInput>>;
  connectOrCreate?: Maybe<Array<TransactionsCreateOrConnectWithoutuserInput>>;
};

export type StacksUpdateWithoutBudgetInput = {
  label?: Maybe<StringFieldUpdateOperationsInput>;
  amount?: Maybe<FloatFieldUpdateOperationsInput>;
  created_at?: Maybe<DateTimeFieldUpdateOperationsInput>;
};

export type StacksUpdateManyMutationInput = {
  label?: Maybe<StringFieldUpdateOperationsInput>;
  amount?: Maybe<FloatFieldUpdateOperationsInput>;
  created_at?: Maybe<DateTimeFieldUpdateOperationsInput>;
};

export type BudgetUpdateOneWithoutUserInput = {
  create?: Maybe<BudgetCreateWithoutUserInput>;
  connect?: Maybe<BudgetWhereUniqueInput>;
  disconnect?: Maybe<Scalars['Boolean']>;
  delete?: Maybe<Scalars['Boolean']>;
  update?: Maybe<BudgetUpdateWithoutUserInput>;
  upsert?: Maybe<BudgetUpsertWithoutUserInput>;
  connectOrCreate?: Maybe<BudgetCreateOrConnectWithoutuserInput>;
};

export type NestedFloatNullableFilter = {
  equals?: Maybe<Scalars['Float']>;
  in?: Maybe<Array<Scalars['Float']>>;
  notIn?: Maybe<Array<Scalars['Float']>>;
  lt?: Maybe<Scalars['Float']>;
  lte?: Maybe<Scalars['Float']>;
  gt?: Maybe<Scalars['Float']>;
  gte?: Maybe<Scalars['Float']>;
  not?: Maybe<NestedFloatNullableFilter>;
};

export type StacksWhereInput = {
  AND?: Maybe<Array<StacksWhereInput>>;
  OR?: Maybe<Array<StacksWhereInput>>;
  NOT?: Maybe<Array<StacksWhereInput>>;
  id?: Maybe<IntFilter>;
  budgetId?: Maybe<IntFilter>;
  label?: Maybe<StringFilter>;
  amount?: Maybe<FloatFilter>;
  created_at?: Maybe<DateTimeFilter>;
  budget?: Maybe<BudgetWhereInput>;
};

export type TransactionsUpdateWithWhereUniqueWithoutUserInput = {
  where: TransactionsWhereUniqueInput;
  data: TransactionsUpdateWithoutUserInput;
};

export type TransactionsUpdateManyWithWhereWithoutUserInput = {
  where: TransactionsScalarWhereInput;
  data: TransactionsUpdateManyMutationInput;
};

export type TransactionsScalarWhereInput = {
  AND?: Maybe<Array<TransactionsScalarWhereInput>>;
  OR?: Maybe<Array<TransactionsScalarWhereInput>>;
  NOT?: Maybe<Array<TransactionsScalarWhereInput>>;
  id?: Maybe<IntFilter>;
  description?: Maybe<StringFilter>;
  stack?: Maybe<StringFilter>;
  amount?: Maybe<FloatFilter>;
  type?: Maybe<StringFilter>;
  userId?: Maybe<IntFilter>;
  date?: Maybe<DateTimeFilter>;
};

export type TransactionsUpsertWithWhereUniqueWithoutUserInput = {
  where: TransactionsWhereUniqueInput;
  update: TransactionsUpdateWithoutUserInput;
  create: TransactionsCreateWithoutUserInput;
};

export type BudgetUpdateWithoutUserInput = {
  total?: Maybe<NullableFloatFieldUpdateOperationsInput>;
  toBeBudgeted?: Maybe<NullableFloatFieldUpdateOperationsInput>;
  stacks?: Maybe<StacksUpdateManyWithoutBudgetInput>;
};

export type BudgetUpsertWithoutUserInput = {
  update: BudgetUpdateWithoutUserInput;
  create: BudgetCreateWithoutUserInput;
};

export type TransactionsUpdateWithoutUserInput = {
  description?: Maybe<StringFieldUpdateOperationsInput>;
  stack?: Maybe<StringFieldUpdateOperationsInput>;
  amount?: Maybe<FloatFieldUpdateOperationsInput>;
  type?: Maybe<StringFieldUpdateOperationsInput>;
  date?: Maybe<DateTimeFieldUpdateOperationsInput>;
};

export type TransactionsUpdateManyMutationInput = {
  description?: Maybe<StringFieldUpdateOperationsInput>;
  stack?: Maybe<StringFieldUpdateOperationsInput>;
  amount?: Maybe<FloatFieldUpdateOperationsInput>;
  type?: Maybe<StringFieldUpdateOperationsInput>;
  date?: Maybe<DateTimeFieldUpdateOperationsInput>;
};

export type GetStackQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetStackQuery = (
  { __typename?: 'Query' }
  & { stacks: Array<(
    { __typename?: 'stacks' }
    & Pick<Stacks, 'amount' | 'label' | 'id'>
  )> }
);

export type DeleteOneStackMutationVariables = Exact<{
  stackId: Scalars['Int'];
}>;


export type DeleteOneStackMutation = (
  { __typename?: 'Mutation' }
  & { deleteOnestacks?: Maybe<(
    { __typename?: 'stacks' }
    & Pick<Stacks, 'id'>
  )> }
);

export type AddBudgetMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type AddBudgetMutation = (
  { __typename?: 'Mutation' }
  & { createOnebudget: (
    { __typename?: 'budget' }
    & Pick<Budget, 'total' | 'id'>
  ) }
);

export type AddStackMutationVariables = Exact<{
  budgetId: Scalars['Int'];
  newStackLabel: Scalars['String'];
}>;


export type AddStackMutation = (
  { __typename?: 'Mutation' }
  & { createOnestacks: (
    { __typename?: 'stacks' }
    & Pick<Stacks, 'label' | 'amount' | 'id' | 'budgetId'>
  ) }
);

export type GetBudgetQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetBudgetQuery = (
  { __typename?: 'Query' }
  & { budgets: Array<(
    { __typename?: 'budget' }
    & Pick<Budget, 'id' | 'userId' | 'total' | 'toBeBudgeted'>
    & { stacks: Array<(
      { __typename?: 'stacks' }
      & Pick<Stacks, 'id' | 'label' | 'amount' | 'created_at' | 'budgetId'>
    )> }
  )> }
);

export type UpdateStackMutationVariables = Exact<{
  budgetId: Scalars['Int'];
  label: Scalars['String'];
  amount: Scalars['Float'];
}>;


export type UpdateStackMutation = (
  { __typename?: 'Mutation' }
  & { updateOnestacks?: Maybe<(
    { __typename?: 'stacks' }
    & Pick<Stacks, 'label' | 'amount'>
  )> }
);

export type UpdateTotalMutationVariables = Exact<{
  budgetId: Scalars['Int'];
  total: Scalars['Float'];
}>;


export type UpdateTotalMutation = (
  { __typename?: 'Mutation' }
  & { updateOnebudget?: Maybe<(
    { __typename?: 'budget' }
    & Pick<Budget, 'total'>
  )> }
);

export type GetUserQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'id' | 'email'>
    & { budget?: Maybe<(
      { __typename?: 'budget' }
      & Pick<Budget, 'id' | 'total' | 'toBeBudgeted'>
      & { stacks: Array<(
        { __typename?: 'stacks' }
        & Pick<Stacks, 'id' | 'label' | 'amount'>
      )> }
    )>, transactions: Array<(
      { __typename?: 'transactions' }
      & Pick<Transactions, 'description' | 'date' | 'id' | 'amount' | 'stack' | 'type'>
    )> }
  )> }
);

export type SelectedTransactionFragment = (
  { __typename?: 'transactions' }
  & Pick<Transactions, 'id' | 'amount' | 'date' | 'stack' | 'description' | 'type'>
);

export type UploadFileMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadFileMutation = (
  { __typename?: 'Mutation' }
  & { uploadFile?: Maybe<(
    { __typename?: 'UploadFile' }
    & Pick<UploadFile, 'uri'>
  )> }
);

export type AddTransactionMutationVariables = Exact<{
  description: Scalars['String'];
  stack: Scalars['String'];
  amount: Scalars['Float'];
  type: Scalars['String'];
  email: Scalars['String'];
  date: Scalars['DateTime'];
}>;


export type AddTransactionMutation = (
  { __typename?: 'Mutation' }
  & { createOnetransactions: (
    { __typename?: 'transactions' }
    & Pick<Transactions, 'id' | 'description' | 'amount' | 'stack' | 'type' | 'userId' | 'date'>
  ) }
);

export type DeleteManyTransactionsMutationVariables = Exact<{
  transactionIds?: Maybe<Array<Scalars['Int']>>;
}>;


export type DeleteManyTransactionsMutation = (
  { __typename?: 'Mutation' }
  & { deleteManytransactions: (
    { __typename?: 'BatchPayload' }
    & Pick<BatchPayload, 'count'>
  ) }
);

export type EditTransactionMutationVariables = Exact<{
  id: Scalars['Int'];
  amount?: Maybe<Scalars['Float']>;
  stack?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['DateTime']>;
  type?: Maybe<Scalars['String']>;
}>;


export type EditTransactionMutation = (
  { __typename?: 'Mutation' }
  & { updateOnetransactions?: Maybe<(
    { __typename?: 'transactions' }
    & Pick<Transactions, 'id' | 'amount' | 'stack' | 'description' | 'date'>
  )> }
);

export type GetTransactionsQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetTransactionsQuery = (
  { __typename?: 'Query' }
  & { transactions: Array<(
    { __typename?: 'transactions' }
    & Pick<Transactions, 'id' | 'amount' | 'description' | 'stack' | 'date' | 'type'>
  )> }
);

export type GetStackLabelsQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetStackLabelsQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'id'>
    & { budget?: Maybe<(
      { __typename?: 'budget' }
      & { stacks: Array<(
        { __typename?: 'stacks' }
        & Pick<Stacks, 'label'>
      )> }
    )> }
  )> }
);

export const SelectedTransactionFragmentDoc = gql`
    fragment selectedTransaction on transactions {
  id
  amount
  date
  stack
  description
  type
}
    `;
export const GetStackDocument = gql`
    query getStack($id: Int!) {
  stacks(where: {id: {equals: $id}}) {
    amount
    label
    id
  }
}
    `;

/**
 * __useGetStackQuery__
 *
 * To run a query within a React component, call `useGetStackQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStackQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStackQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStackQuery(baseOptions: Apollo.QueryHookOptions<GetStackQuery, GetStackQueryVariables>) {
        return Apollo.useQuery<GetStackQuery, GetStackQueryVariables>(GetStackDocument, baseOptions);
      }
export function useGetStackLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStackQuery, GetStackQueryVariables>) {
          return Apollo.useLazyQuery<GetStackQuery, GetStackQueryVariables>(GetStackDocument, baseOptions);
        }
export type GetStackQueryHookResult = ReturnType<typeof useGetStackQuery>;
export type GetStackLazyQueryHookResult = ReturnType<typeof useGetStackLazyQuery>;
export type GetStackQueryResult = Apollo.QueryResult<GetStackQuery, GetStackQueryVariables>;
export const DeleteOneStackDocument = gql`
    mutation deleteOneStack($stackId: Int!) {
  deleteOnestacks(where: {id: $stackId}) {
    id
  }
}
    `;
export type DeleteOneStackMutationFn = Apollo.MutationFunction<DeleteOneStackMutation, DeleteOneStackMutationVariables>;

/**
 * __useDeleteOneStackMutation__
 *
 * To run a mutation, you first call `useDeleteOneStackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOneStackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOneStackMutation, { data, loading, error }] = useDeleteOneStackMutation({
 *   variables: {
 *      stackId: // value for 'stackId'
 *   },
 * });
 */
export function useDeleteOneStackMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOneStackMutation, DeleteOneStackMutationVariables>) {
        return Apollo.useMutation<DeleteOneStackMutation, DeleteOneStackMutationVariables>(DeleteOneStackDocument, baseOptions);
      }
export type DeleteOneStackMutationHookResult = ReturnType<typeof useDeleteOneStackMutation>;
export type DeleteOneStackMutationResult = Apollo.MutationResult<DeleteOneStackMutation>;
export type DeleteOneStackMutationOptions = Apollo.BaseMutationOptions<DeleteOneStackMutation, DeleteOneStackMutationVariables>;
export const AddBudgetDocument = gql`
    mutation addBudget($email: String!) {
  createOnebudget(
    data: {user: {connect: {email: $email}}, total: 0, toBeBudgeted: 0}
  ) {
    total
    id
  }
}
    `;
export type AddBudgetMutationFn = Apollo.MutationFunction<AddBudgetMutation, AddBudgetMutationVariables>;

/**
 * __useAddBudgetMutation__
 *
 * To run a mutation, you first call `useAddBudgetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBudgetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBudgetMutation, { data, loading, error }] = useAddBudgetMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useAddBudgetMutation(baseOptions?: Apollo.MutationHookOptions<AddBudgetMutation, AddBudgetMutationVariables>) {
        return Apollo.useMutation<AddBudgetMutation, AddBudgetMutationVariables>(AddBudgetDocument, baseOptions);
      }
export type AddBudgetMutationHookResult = ReturnType<typeof useAddBudgetMutation>;
export type AddBudgetMutationResult = Apollo.MutationResult<AddBudgetMutation>;
export type AddBudgetMutationOptions = Apollo.BaseMutationOptions<AddBudgetMutation, AddBudgetMutationVariables>;
export const AddStackDocument = gql`
    mutation addStack($budgetId: Int!, $newStackLabel: String!) {
  createOnestacks(
    data: {label: $newStackLabel, budget: {connect: {id: $budgetId}}}
  ) {
    label
    amount
    id
    budgetId
  }
}
    `;
export type AddStackMutationFn = Apollo.MutationFunction<AddStackMutation, AddStackMutationVariables>;

/**
 * __useAddStackMutation__
 *
 * To run a mutation, you first call `useAddStackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddStackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addStackMutation, { data, loading, error }] = useAddStackMutation({
 *   variables: {
 *      budgetId: // value for 'budgetId'
 *      newStackLabel: // value for 'newStackLabel'
 *   },
 * });
 */
export function useAddStackMutation(baseOptions?: Apollo.MutationHookOptions<AddStackMutation, AddStackMutationVariables>) {
        return Apollo.useMutation<AddStackMutation, AddStackMutationVariables>(AddStackDocument, baseOptions);
      }
export type AddStackMutationHookResult = ReturnType<typeof useAddStackMutation>;
export type AddStackMutationResult = Apollo.MutationResult<AddStackMutation>;
export type AddStackMutationOptions = Apollo.BaseMutationOptions<AddStackMutation, AddStackMutationVariables>;
export const GetBudgetDocument = gql`
    query getBudget($email: String!) {
  budgets(where: {user: {email: {equals: $email}}}) {
    id
    userId
    total
    toBeBudgeted
    stacks(orderBy: {created_at: asc}) {
      id
      label
      amount
      created_at
      budgetId
    }
  }
}
    `;

/**
 * __useGetBudgetQuery__
 *
 * To run a query within a React component, call `useGetBudgetQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBudgetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBudgetQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGetBudgetQuery(baseOptions: Apollo.QueryHookOptions<GetBudgetQuery, GetBudgetQueryVariables>) {
        return Apollo.useQuery<GetBudgetQuery, GetBudgetQueryVariables>(GetBudgetDocument, baseOptions);
      }
export function useGetBudgetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBudgetQuery, GetBudgetQueryVariables>) {
          return Apollo.useLazyQuery<GetBudgetQuery, GetBudgetQueryVariables>(GetBudgetDocument, baseOptions);
        }
export type GetBudgetQueryHookResult = ReturnType<typeof useGetBudgetQuery>;
export type GetBudgetLazyQueryHookResult = ReturnType<typeof useGetBudgetLazyQuery>;
export type GetBudgetQueryResult = Apollo.QueryResult<GetBudgetQuery, GetBudgetQueryVariables>;
export const UpdateStackDocument = gql`
    mutation updateStack($budgetId: Int!, $label: String!, $amount: Float!) {
  updateOnestacks(
    data: {amount: {set: $amount}}
    where: {budgetId_label_idx: {budgetId: $budgetId, label: $label}}
  ) {
    label
    amount
  }
}
    `;
export type UpdateStackMutationFn = Apollo.MutationFunction<UpdateStackMutation, UpdateStackMutationVariables>;

/**
 * __useUpdateStackMutation__
 *
 * To run a mutation, you first call `useUpdateStackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStackMutation, { data, loading, error }] = useUpdateStackMutation({
 *   variables: {
 *      budgetId: // value for 'budgetId'
 *      label: // value for 'label'
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useUpdateStackMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStackMutation, UpdateStackMutationVariables>) {
        return Apollo.useMutation<UpdateStackMutation, UpdateStackMutationVariables>(UpdateStackDocument, baseOptions);
      }
export type UpdateStackMutationHookResult = ReturnType<typeof useUpdateStackMutation>;
export type UpdateStackMutationResult = Apollo.MutationResult<UpdateStackMutation>;
export type UpdateStackMutationOptions = Apollo.BaseMutationOptions<UpdateStackMutation, UpdateStackMutationVariables>;
export const UpdateTotalDocument = gql`
    mutation updateTotal($budgetId: Int!, $total: Float!) {
  updateOnebudget(data: {total: {set: $total}}, where: {id: $budgetId}) {
    total
  }
}
    `;
export type UpdateTotalMutationFn = Apollo.MutationFunction<UpdateTotalMutation, UpdateTotalMutationVariables>;

/**
 * __useUpdateTotalMutation__
 *
 * To run a mutation, you first call `useUpdateTotalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTotalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTotalMutation, { data, loading, error }] = useUpdateTotalMutation({
 *   variables: {
 *      budgetId: // value for 'budgetId'
 *      total: // value for 'total'
 *   },
 * });
 */
export function useUpdateTotalMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTotalMutation, UpdateTotalMutationVariables>) {
        return Apollo.useMutation<UpdateTotalMutation, UpdateTotalMutationVariables>(UpdateTotalDocument, baseOptions);
      }
export type UpdateTotalMutationHookResult = ReturnType<typeof useUpdateTotalMutation>;
export type UpdateTotalMutationResult = Apollo.MutationResult<UpdateTotalMutation>;
export type UpdateTotalMutationOptions = Apollo.BaseMutationOptions<UpdateTotalMutation, UpdateTotalMutationVariables>;
export const GetUserDocument = gql`
    query getUser($email: String!) {
  user(where: {email: $email}) {
    id
    email
    budget {
      id
      total
      toBeBudgeted
      stacks(orderBy: {created_at: asc}) {
        id
        label
        amount
      }
    }
    transactions {
      description
      date
      id
      amount
      stack
      type
    }
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const UploadFileDocument = gql`
    mutation uploadFile($file: Upload!) {
  uploadFile(file: $file) {
    uri
  }
}
    `;
export type UploadFileMutationFn = Apollo.MutationFunction<UploadFileMutation, UploadFileMutationVariables>;

/**
 * __useUploadFileMutation__
 *
 * To run a mutation, you first call `useUploadFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadFileMutation, { data, loading, error }] = useUploadFileMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadFileMutation(baseOptions?: Apollo.MutationHookOptions<UploadFileMutation, UploadFileMutationVariables>) {
        return Apollo.useMutation<UploadFileMutation, UploadFileMutationVariables>(UploadFileDocument, baseOptions);
      }
export type UploadFileMutationHookResult = ReturnType<typeof useUploadFileMutation>;
export type UploadFileMutationResult = Apollo.MutationResult<UploadFileMutation>;
export type UploadFileMutationOptions = Apollo.BaseMutationOptions<UploadFileMutation, UploadFileMutationVariables>;
export const AddTransactionDocument = gql`
    mutation addTransaction($description: String!, $stack: String!, $amount: Float!, $type: String!, $email: String!, $date: DateTime!) {
  createOnetransactions(
    data: {description: $description, stack: $stack, amount: $amount, type: $type, date: $date, user: {connect: {email: $email}}}
  ) {
    id
    description
    amount
    stack
    type
    userId
    date
  }
}
    `;
export type AddTransactionMutationFn = Apollo.MutationFunction<AddTransactionMutation, AddTransactionMutationVariables>;

/**
 * __useAddTransactionMutation__
 *
 * To run a mutation, you first call `useAddTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTransactionMutation, { data, loading, error }] = useAddTransactionMutation({
 *   variables: {
 *      description: // value for 'description'
 *      stack: // value for 'stack'
 *      amount: // value for 'amount'
 *      type: // value for 'type'
 *      email: // value for 'email'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useAddTransactionMutation(baseOptions?: Apollo.MutationHookOptions<AddTransactionMutation, AddTransactionMutationVariables>) {
        return Apollo.useMutation<AddTransactionMutation, AddTransactionMutationVariables>(AddTransactionDocument, baseOptions);
      }
export type AddTransactionMutationHookResult = ReturnType<typeof useAddTransactionMutation>;
export type AddTransactionMutationResult = Apollo.MutationResult<AddTransactionMutation>;
export type AddTransactionMutationOptions = Apollo.BaseMutationOptions<AddTransactionMutation, AddTransactionMutationVariables>;
export const DeleteManyTransactionsDocument = gql`
    mutation deleteManyTransactions($transactionIds: [Int!]) {
  deleteManytransactions(where: {id: {in: $transactionIds}}) {
    count
  }
}
    `;
export type DeleteManyTransactionsMutationFn = Apollo.MutationFunction<DeleteManyTransactionsMutation, DeleteManyTransactionsMutationVariables>;

/**
 * __useDeleteManyTransactionsMutation__
 *
 * To run a mutation, you first call `useDeleteManyTransactionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteManyTransactionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteManyTransactionsMutation, { data, loading, error }] = useDeleteManyTransactionsMutation({
 *   variables: {
 *      transactionIds: // value for 'transactionIds'
 *   },
 * });
 */
export function useDeleteManyTransactionsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteManyTransactionsMutation, DeleteManyTransactionsMutationVariables>) {
        return Apollo.useMutation<DeleteManyTransactionsMutation, DeleteManyTransactionsMutationVariables>(DeleteManyTransactionsDocument, baseOptions);
      }
export type DeleteManyTransactionsMutationHookResult = ReturnType<typeof useDeleteManyTransactionsMutation>;
export type DeleteManyTransactionsMutationResult = Apollo.MutationResult<DeleteManyTransactionsMutation>;
export type DeleteManyTransactionsMutationOptions = Apollo.BaseMutationOptions<DeleteManyTransactionsMutation, DeleteManyTransactionsMutationVariables>;
export const EditTransactionDocument = gql`
    mutation editTransaction($id: Int!, $amount: Float, $stack: String, $description: String, $date: DateTime, $type: String) {
  updateOnetransactions(
    where: {id: $id}
    data: {description: {set: $description}, stack: {set: $stack}, amount: {set: $amount}, type: {set: $type}, date: {set: $date}}
  ) {
    id
    amount
    stack
    description
    date
  }
}
    `;
export type EditTransactionMutationFn = Apollo.MutationFunction<EditTransactionMutation, EditTransactionMutationVariables>;

/**
 * __useEditTransactionMutation__
 *
 * To run a mutation, you first call `useEditTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editTransactionMutation, { data, loading, error }] = useEditTransactionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      amount: // value for 'amount'
 *      stack: // value for 'stack'
 *      description: // value for 'description'
 *      date: // value for 'date'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useEditTransactionMutation(baseOptions?: Apollo.MutationHookOptions<EditTransactionMutation, EditTransactionMutationVariables>) {
        return Apollo.useMutation<EditTransactionMutation, EditTransactionMutationVariables>(EditTransactionDocument, baseOptions);
      }
export type EditTransactionMutationHookResult = ReturnType<typeof useEditTransactionMutation>;
export type EditTransactionMutationResult = Apollo.MutationResult<EditTransactionMutation>;
export type EditTransactionMutationOptions = Apollo.BaseMutationOptions<EditTransactionMutation, EditTransactionMutationVariables>;
export const GetTransactionsDocument = gql`
    query getTransactions($email: String!) {
  transactions(where: {user: {email: {equals: $email}}}, orderBy: {date: desc}) {
    id
    amount
    description
    stack
    date
    type
  }
}
    `;

/**
 * __useGetTransactionsQuery__
 *
 * To run a query within a React component, call `useGetTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionsQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGetTransactionsQuery(baseOptions: Apollo.QueryHookOptions<GetTransactionsQuery, GetTransactionsQueryVariables>) {
        return Apollo.useQuery<GetTransactionsQuery, GetTransactionsQueryVariables>(GetTransactionsDocument, baseOptions);
      }
export function useGetTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTransactionsQuery, GetTransactionsQueryVariables>) {
          return Apollo.useLazyQuery<GetTransactionsQuery, GetTransactionsQueryVariables>(GetTransactionsDocument, baseOptions);
        }
export type GetTransactionsQueryHookResult = ReturnType<typeof useGetTransactionsQuery>;
export type GetTransactionsLazyQueryHookResult = ReturnType<typeof useGetTransactionsLazyQuery>;
export type GetTransactionsQueryResult = Apollo.QueryResult<GetTransactionsQuery, GetTransactionsQueryVariables>;
export const GetStackLabelsDocument = gql`
    query getStackLabels($email: String!) {
  user(where: {email: $email}) {
    id
    budget {
      stacks {
        label
      }
    }
  }
}
    `;

/**
 * __useGetStackLabelsQuery__
 *
 * To run a query within a React component, call `useGetStackLabelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStackLabelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStackLabelsQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGetStackLabelsQuery(baseOptions: Apollo.QueryHookOptions<GetStackLabelsQuery, GetStackLabelsQueryVariables>) {
        return Apollo.useQuery<GetStackLabelsQuery, GetStackLabelsQueryVariables>(GetStackLabelsDocument, baseOptions);
      }
export function useGetStackLabelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStackLabelsQuery, GetStackLabelsQueryVariables>) {
          return Apollo.useLazyQuery<GetStackLabelsQuery, GetStackLabelsQueryVariables>(GetStackLabelsDocument, baseOptions);
        }
export type GetStackLabelsQueryHookResult = ReturnType<typeof useGetStackLabelsQuery>;
export type GetStackLabelsLazyQueryHookResult = ReturnType<typeof useGetStackLabelsLazyQuery>;
export type GetStackLabelsQueryResult = Apollo.QueryResult<GetStackLabelsQuery, GetStackLabelsQueryVariables>;