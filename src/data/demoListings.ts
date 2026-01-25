// Demo listings data - 500 items across 12 categories
// These are exploratory items, not real IP assets

export interface DemoListing {
  id: string;
  category: string;
  name: string;
  description: string;
  registration_number: string;
  price: number | null;
  price_negotiable: boolean;
  status: "demo";
  views_count: number;
  favorites_count: number;
  cart_count: number;
  is_demo: boolean;
  demo_label: string;
  legal_status: string;
  can_buy: boolean;
  created_at: string;
  user_id: string;
}

// Realistic naming patterns per category - clean titles without "Ознакомительный" prefix
const categoryData: Record<string, { type: string; names: string[]; descriptions: string[] }> = {
  techpacks: {
    type: "Технологический пакет",
    names: [
      "«AquaFlow System»", "«ThermoGuard Pro»", "«NanoFilter Matrix»", "«BioSync Platform»",
      "«EcoProcess Suite»", "«SmartGrid Controller»", "«HydroTech Solutions»", "«CryoStore Module»",
      "«PlasmaPure System»", "«SolarMax Integration»", "«WindTech Optimizer»", "«GeoSense Array»",
      "«AtmoClean Technology»", "«WavePower Generator»", "«FusionCore Framework»", "«QuantumLink Hub»",
      "«NeuroBridge Protocol»", "«CarbonZero Process»", "«MicroScale Assembly»", "«OptiFlow Network»",
      "«PyroSafe System»", "«AeroClean Module»", "«TerraForm Suite»", "«HoloScan Platform»",
      "«VoltEdge Controller»", "«ClearWater Tech»", "«SonicPulse Array»", "«LaserCut Solutions»",
      "«MagLev Transport»", "«BioPrint System»", "«AgriSmart Platform»", "«MedTech Suite»",
      "«RoboAssist Framework»", "«DroneGuard System»", "«SmartBuild Module»", "«EnergyStore Hub»",
      "«CleanAir Network»", "«WasteZero Process»", "«FoodTech Solutions»", "«TextilePro System»",
      "«ChemPure Platform»", "«MetalForm Suite»"
    ],
    descriptions: [
      "Комплексное решение для автоматизации промышленных процессов с интеграцией IoT-датчиков и системой предиктивной аналитики.",
      "Технологический комплекс для оптимизации энергопотребления на производственных объектах с модульной архитектурой.",
      "Платформа управления технологическими процессами с поддержкой распределённых вычислений и удалённого мониторинга.",
      "Интегрированная система контроля качества продукции с применением машинного зрения и нейросетевого анализа.",
      "Модульное решение для цифровизации производственных линий с возможностью масштабирования.",
    ]
  },
  "ai-models": {
    type: "Модель ИИ",
    names: [
      "«PredictNet Core»", "«VisionAI Pro»", "«NeuralPath Engine»", "«DeepAnalytics Suite»",
      "«CogniSense Model»", "«AutoML Framework»", "«PatternMind System»", "«DataSynth AI»",
      "«SmartPredict Hub»", "«IntelliProcess Core»", "«SemanticFlow Engine»", "«AdaptLearn Suite»",
      "«RiskAI Analyzer»", "«ForecastPro Model»", "«ClassifyNet System»", "«ClusterMind Hub»",
      "«NLP Processor Pro»", "«ImageSense Core»", "«VoiceAI Engine»", "«TextMiner Suite»",
      "«AnomalyDetect Model»", "«RecommendAI System»", "«OptimizeNet Hub»", "«SegmentPro Core»",
      "«TranslateAI Engine»", "«SentimentPro Suite»", "«ObjectTrack Model»", "«FaceMatch System»",
      "«SpeechSynth Hub»", "«DocuAI Analyzer»", "«ChartMind Core»", "«PricePredict Engine»",
      "«DemandForecast Suite»", "«QualityAI Model»", "«MaintenancePredict System»", "«RoutePlanner Hub»",
      "«InventoryAI Core»", "«CustomerInsight Engine»", "«FraudDetect Suite»", "«CreditScore Model»",
      "«ChurnPredict System»", "«LeadScore Hub»"
    ],
    descriptions: [
      "Нейросетевая модель для предиктивной аналитики с поддержкой обработки временных рядов и мультимодальных данных.",
      "Алгоритмический комплекс для автоматической классификации и сегментации данных в режиме реального времени.",
      "Система машинного обучения для выявления аномалий и паттернов в больших массивах структурированных данных.",
      "Модель глубокого обучения для обработки естественного языка с поддержкой русского и английского языков.",
      "Комплексный алгоритм для прогнозирования спроса и оптимизации ресурсов на основе исторических данных.",
    ]
  },
  software: {
    type: "Программный продукт",
    names: [
      "«DocuFlow Manager»", "«TaskMaster Pro»", "«CloudSync Platform»", "«SecureVault System»",
      "«DataBridge Connector»", "«ReportGen Suite»", "«WorkFlow Engine»", "«TeamSpace Hub»",
      "«InventoryPro System»", "«FinanceCore Platform»", "«HRManager Suite»", "«CRMaster Engine»",
      "«ProjectTrack Hub»", "«SalesForce Pro»", "«SupportDesk System»", "«ContractMaster Platform»",
      "«BillingPro Suite»", "«AssetManager Engine»", "«LogiTrack Hub»", "«SupplyChain Pro»",
      "«QualityControl System»", "«ProductionPlan Platform»", "«MaintenanceLog Suite»", "«SafetyCheck Engine»",
      "«ComplianceHub Pro»", "«AuditTrail System»", "«BackupMaster Platform»", "«MonitorPro Suite»",
      "«AlertSystem Engine»", "«DashboardPro Hub»", "«AnalyticsMaster Pro»", "«IntegrationBridge System»",
      "«APIGateway Platform»", "«MessageQueue Suite»", "«CacheMaster Engine»", "«LoadBalancer Hub»",
      "«ContainerOrch Pro»", "«ServiceMesh System»", "«EventProcessor Platform»", "«StreamHandler Suite»",
      "«BatchRunner Engine»", "«SchedulerPro Hub»"
    ],
    descriptions: [
      "Корпоративная платформа для управления документооборотом с поддержкой электронной подписи и версионирования.",
      "Система автоматизации бизнес-процессов с визуальным конструктором workflow и интеграцией с внешними сервисами.",
      "Программный комплекс для централизованного управления IT-инфраструктурой с функциями мониторинга и алертинга.",
      "Модульное решение для управления проектами с поддержкой гибких методологий и ресурсного планирования.",
      "Платформа для автоматизации финансового учёта с поддержкой мультивалютности и формирования отчётности.",
    ]
  },
  datasets: {
    type: "Датасет",
    names: [
      "«RetailInsight Dataset»", "«FinanceMetrics Collection»", "«HealthData Repository»", "«TransportFlow Archive»",
      "«ConsumerBehavior Set»", "«IndustrialSensors Data»", "«WeatherPatterns Collection»", "«SocialMedia Repository»",
      "«EcommerceTransactions Archive»", "«ManufacturingQuality Set»", "«EnergyConsumption Data»", "«RealEstate Collection»",
      "«JobMarket Repository»", "«EducationMetrics Archive»", "«TravelPatterns Set»", "«FoodService Data»",
      "«InsuranceClaims Collection»", "«TelecomUsage Repository»", "«MediaConsumption Archive»", "«SportStats Set»",
      "«AgricultureYield Data»", "«EnvironmentalMonitor Collection»", "«TrafficFlow Repository»", "«CrimeStats Archive»",
      "«DemographicTrends Set»", "«EconomicIndicators Data»", "«SupplyChain Collection»", "«CustomerFeedback Repository»",
      "«ProductReviews Archive»", "«PriceHistory Set»", "«InventoryLevels Data»", "«SalesPerformance Collection»",
      "«MarketingCampaigns Repository»", "«WebAnalytics Archive»", "«AppUsage Set»", "«DeviceMetrics Data»",
      "«NetworkTraffic Collection»", "«ServerLogs Repository»", "«SecurityEvents Archive»", "«UserBehavior Set»",
      "«ContentEngagement Data»", "«AdPerformance Collection»"
    ],
    descriptions: [
      "Структурированная выборка данных для обучения моделей машинного обучения в сфере розничной торговли.",
      "Агрегированный набор данных для анализа потребительского поведения и построения рекомендательных систем.",
      "Коллекция размеченных данных для задач классификации и регрессии в области финансовой аналитики.",
      "Датасет временных рядов для прогнозирования и выявления трендов в промышленных процессах.",
      "Набор данных для обучения NLP-моделей с поддержкой русскоязычного контента.",
    ]
  },
  patents: {
    type: "Патент",
    names: [
      "«Метод адаптивной фильтрации»", "«Способ термической обработки»", "«Устройство контроля давления»",
      "«Система распределённого хранения»", "«Метод оптимизации маршрутов»", "«Способ очистки жидкостей»",
      "«Устройство измерения параметров»", "«Система автоматического управления»", "«Метод синтеза материалов»",
      "«Способ обработки сигналов»", "«Устройство генерации энергии»", "«Система мониторинга состояния»",
      "«Метод прогнозирования отказов»", "«Способ защиты данных»", "«Устройство беспроводной связи»",
      "«Система позиционирования объектов»", "«Метод компрессии информации»", "«Способ визуализации данных»",
      "«Устройство захвата изображений»", "«Система распознавания образов»", "«Метод машинного обучения»",
      "«Способ обработки запросов»", "«Устройство хранения информации»", "«Система балансировки нагрузки»",
      "«Метод шифрования данных»", "«Способ аутентификации пользователей»", "«Устройство биометрического контроля»",
      "«Система управления доступом»", "«Метод оптимизации запросов»", "«Способ кэширования данных»",
      "«Устройство мониторинга сети»", "«Система обнаружения аномалий»", "«Метод резервного копирования»",
      "«Способ восстановления данных»", "«Устройство синхронизации»", "«Система репликации»",
      "«Метод миграции данных»", "«Способ валидации транзакций»", "«Устройство обработки платежей»",
      "«Система верификации документов»", "«Метод цифровой подписи»", "«Способ блокчейн-хранения»"
    ],
    descriptions: [
      "Изобретение относится к области автоматизации и может быть использовано для повышения эффективности производственных процессов.",
      "Техническое решение направлено на улучшение характеристик существующих систем контроля и мониторинга.",
      "Патентуемый способ обеспечивает повышение надёжности и снижение энергопотребления промышленного оборудования.",
      "Изобретение предназначено для применения в телекоммуникационных системах и обеспечивает улучшенную защиту данных.",
      "Технологическое решение позволяет оптимизировать обработку информации в распределённых вычислительных системах.",
    ]
  },
  databases: {
    type: "База данных",
    names: [
      "«Retail Insight Pro»", "«Finance Analytics Hub»", "«Medical Records System»", "«Logistics Tracker DB»",
      "«Customer360 Repository»", "«ProductCatalog Master»", "«SupplierNetwork Base»", "«EmployeeDirectory Hub»",
      "«ContractRegistry System»", "«AssetInventory DB»", "«OrderManagement Repository»", "«InvoiceArchive Master»",
      "«PaymentHistory Base»", "«ShipmentTracker Hub»", "«WarehouseStock System»", "«VendorRatings DB»",
      "«PriceComparison Repository»", "«MarketResearch Master»", "«CompetitorAnalysis Base»", "«TrendMonitor Hub»",
      "«FeedbackCollector System»", "«SurveyResults DB»", "«LeadDatabase Repository»", "«CampaignMetrics Master»",
      "«ContentLibrary Base»", "«MediaAssets Hub»", "«DocumentArchive System»", "«KnowledgeBase DB»",
      "«FAQRepository Master»", "«TicketHistory Base»", "«IncidentLog Hub»", "«ChangeManagement System»",
      "«ReleaseNotes DB»", "«FeatureRequests Repository»", "«BugTracker Master»", "«TestCases Base»",
      "«QAMetrics Hub»", "«DeploymentLog System»", "«ConfigurationDB Master»", "«EnvironmentRegistry Base»",
      "«ServiceCatalog Hub»", "«APIRegistry System»"
    ],
    descriptions: [
      "Структурированная база данных для хранения и анализа бизнес-информации с поддержкой сложных запросов.",
      "Репозиторий данных с реляционной структурой для интеграции с корпоративными системами управления.",
      "База данных с оптимизированной индексацией для высокопроизводительного поиска и агрегации.",
      "Хранилище данных с поддержкой версионирования и аудита изменений для соответствия регуляторным требованиям.",
      "Распределённая база данных с механизмами репликации и обеспечения отказоустойчивости.",
    ]
  },
  knowhow: {
    type: "Ноу-хау",
    names: [
      "«ThermoProcess Technique»", "«BioSynth Method»", "«NanoCoating Formula»", "«CryoPreserve Protocol»",
      "«HydroExtract Process»", "«SolarCapture Technique»", "«WindHarvest Method»", "«GeoThermal Formula»",
      "«PlasmaClean Protocol»", "«LaserWeld Process»", "«UltraSonic Technique»", "«MicroMill Method»",
      "«ElectroPolish Formula»", "«VacuumDeposit Protocol»", "«ChemEtch Process»", "«HeatTreat Technique»",
      "«ColdForm Method»", "«PrecisionCast Formula»", "«RapidPrototype Protocol»", "«AdditiveManufacture Process»",
      "«SurfaceFinish Technique»", "«QualityAssure Method»", "«LeakTest Formula»", "«StrengthTest Protocol»",
      "«Calibration Process»", "«Sterilization Technique»", "«Packaging Method»", "«StorageOptimize Formula»",
      "«LogisticsRoute Protocol»", "«InventoryBalance Process»", "«DemandForecast Technique»", "«PriceOptimize Method»",
      "«CustomerSegment Formula»", "«RetentionBoost Protocol»", "«ConversionOptimize Process»", "«ABTest Technique»",
      "«PersonalizationEngine Method»", "«RecommendationTune Formula»", "«SearchRank Protocol»", "«ContentOptimize Process»",
      "«EngagementBoost Technique»", "«ViralGrowth Method»"
    ],
    descriptions: [
      "Конфиденциальная производственная методика, обеспечивающая конкурентное преимущество в отрасли.",
      "Секрет производства с документированными параметрами и условиями применения в промышленных масштабах.",
      "Технологическое ноу-хау для оптимизации производственных процессов с подтверждённой эффективностью.",
      "Уникальная методика обработки материалов с детализированными инструкциями и спецификациями.",
      "Коммерческая тайна в области технологий производства с защитой режимом конфиденциальности.",
    ]
  },
  specifications: {
    type: "Техспецификация",
    names: [
      "«Industrial Controller Spec»", "«Network Protocol Standard»", "«API Interface Definition»", "«DataFormat Schema»",
      "«SecurityPolicy Framework»", "«QualityMetrics Standard»", "«TestProcedure Protocol»", "«DeploymentGuide Spec»",
      "«IntegrationManual Definition»", "«UserInterface Schema»", "«DatabaseDesign Framework»", "«SystemArchitecture Standard»",
      "«PerformanceBenchmark Protocol»", "«ScalabilityRequirements Spec»", "«ReliabilityStandard Definition»",
      "«MaintainabilityGuide Schema»", "«UsabilityFramework Standard»", "«AccessibilityProtocol Spec»",
      "«LocalizationRequirements Definition»", "«DocumentationStandard Schema»", "«VersionControl Framework»",
      "«BranchingStrategy Standard»", "«ReleaseProcess Protocol»", "«HotfixProcedure Spec»", "«RollbackPlan Definition»",
      "«DisasterRecovery Schema»", "«BackupPolicy Framework»", "«MonitoringSetup Standard»", "«AlertConfiguration Protocol»",
      "«IncidentResponse Spec»", "«EscalationProcedure Definition»", "«SLADefinition Schema»", "«CapacityPlanning Framework»",
      "«ResourceAllocation Standard»", "«CostOptimization Protocol»", "«BudgetForecast Spec»", "«VendorEvaluation Definition»",
      "«ContractTerms Schema»", "«ComplianceChecklist Framework»", "«AuditProcedure Standard»", "«RiskAssessment Protocol»",
      "«SecurityAudit Spec»"
    ],
    descriptions: [
      "Техническая документация с детальным описанием требований к системе и параметров функционирования.",
      "Спецификация интерфейсов и протоколов взаимодействия для интеграции с внешними системами.",
      "Стандарт качества с определением метрик, критериев приёмки и процедур тестирования.",
      "Архитектурная документация с описанием компонентов, связей и принципов масштабирования.",
      "Регламент безопасности с требованиями к защите данных и процедурами контроля доступа.",
    ]
  },
  trademarks: {
    type: "Товарный знак",
    names: [
      "«AquaPure»", "«TechnoVision»", "«SmartLife»", "«EcoBalance»", "«NatureFirst»", "«UrbanStyle»", "«FreshChoice»",
      "«PowerMax»", "«SafeGuard»", "«CleanAir»", "«SunBright»", "«WaveRider»", "«StormProof»", "«IronStrength»",
      "«SilkTouch»", "«GoldenHarvest»", "«SilverStream»", "«CrystalClear»", "«VelvetComfort»", "«SteelCore»",
      "«DiamondEdge»", "«PlatinumPlus»", "«BronzeClassic»", "«CopperGlow»", "«MarbleFinish»", "«GraniteForce»",
      "«OakSolid»", "«PineNatural»", "«MapleSweet»", "«CedarFresh»", "«WillowGrace»", "«BirchPure»", "«ElmStrong»",
      "«BeechWarm»", "«AshLight»", "«WalnutRich»", "«CherryBloom»", "«PeachSoft»", "«AppleCrisp»", "«GrapeBold»",
      "«LemonZest»", "«OrangeVibe»"
    ],
    descriptions: [
      "Словесное обозначение для идентификации товаров и услуг в сфере потребительских продуктов.",
      "Товарный знак для маркировки продукции в сегменте технологических решений и сервисов.",
      "Коммерческое обозначение бренда для использования в розничной торговле и e-commerce.",
      "Зарегистрированный знак обслуживания для идентификации услуг в сфере B2B.",
      "Бренд-идентификатор для позиционирования на рынке премиальных товаров и услуг.",
    ]
  },
  copyrights: {
    type: "Авторское право",
    names: [
      "«Руководство по управлению проектами»", "«Курс финансовой грамотности»", "«Учебник по программированию»",
      "«Методика обучения языкам»", "«Сборник бизнес-кейсов»", "«Пособие по маркетингу»", "«Справочник по продажам»",
      "«Гид по переговорам»", "«Тренинг личной эффективности»", "«Программа развития лидерства»",
      "«Курс по тайм-менеджменту»", "«Методика командной работы»", "«Система мотивации персонала»",
      "«Руководство по HR-процессам»", "«Стандарты клиентского сервиса»", "«Скрипты продаж»",
      "«Шаблоны презентаций»", "«Библиотека инфографики»", "«Коллекция иконок»", "«Набор UI-компонентов»",
      "«Фирменный стиль бренда»", "«Гайдлайн визуальной идентичности»", "«Музыкальная библиотека»",
      "«Коллекция звуковых эффектов»", "«Видеокурс по дизайну»", "«Серия обучающих вебинаров»",
      "«Подкаст-серия по бизнесу»", "«Аудиокнига по саморазвитию»", "«Электронный журнал»",
      "«Серия статей по технологиям»", "«Белая книга по индустрии»", "«Аналитический отчёт»",
      "«Исследование рынка»", "«Маркетинговое исследование»", "«Опросник для исследований»",
      "«Методология оценки»", "«Фреймворк анализа»", "«Модель прогнозирования»", "«Калькулятор ROI»",
      "«Симулятор бизнес-процессов»", "«Игровой сценарий»", "«Интерактивный тренажёр»"
    ],
    descriptions: [
      "Авторский образовательный контент с эксклюзивными правами на воспроизведение и распространение.",
      "Оригинальное произведение с защитой авторских прав на текстовые и визуальные материалы.",
      "Методический материал с правами на использование в коммерческих образовательных программах.",
      "Медиаконтент с лицензией на использование в маркетинговых и рекламных целях.",
      "Творческое произведение с правами на адаптацию и создание производных работ.",
    ]
  },
  "digital-twins": {
    type: "Цифровой двойник",
    names: [
      "«Factory Floor Twin»", "«Production Line Model»", "«Warehouse Layout Twin»", "«Supply Chain Simulator»",
      "«Building Energy Model»", "«HVAC System Twin»", "«Power Grid Simulator»", "«Water Network Model»",
      "«Traffic Flow Twin»", "«Airport Operations Simulator»", "«Port Logistics Model»", "«Rail Network Twin»",
      "«Fleet Management Simulator»", "«Vehicle Performance Model»", "«Engine Dynamics Twin»",
      "«Turbine Operation Simulator»", "«Pump System Model»", "«Conveyor Belt Twin»", "«Robot Arm Simulator»",
      "«Assembly Cell Model»", "«Quality Control Twin»", "«Testing Rig Simulator»", "«Lab Equipment Model»",
      "«Clean Room Twin»", "«Data Center Simulator»", "«Server Rack Model»", "«Network Topology Twin»",
      "«Cloud Infrastructure Simulator»", "«Storage Array Model»", "«Cooling System Twin»",
      "«Security System Simulator»", "«Access Control Model»", "«Surveillance Network Twin»",
      "«Fire Safety Simulator»", "«Emergency Response Model»", "«Evacuation Route Twin»",
      "«Crowd Flow Simulator»", "«Event Venue Model»", "«Stadium Operations Twin»",
      "«Retail Store Simulator»", "«Shelf Layout Model»", "«Customer Flow Twin»"
    ],
    descriptions: [
      "Цифровая модель производственного объекта для симуляции процессов и оптимизации операций.",
      "Виртуальный двойник инженерной системы для предиктивного обслуживания и анализа отказов.",
      "Симуляционная модель логистической инфраструктуры для планирования и оптимизации потоков.",
      "Цифровой двойник промышленного оборудования для тестирования сценариев без риска для реальных активов.",
      "Виртуальная копия объекта недвижимости для энергетического моделирования и планирования модернизации.",
    ]
  },
  prototypes: {
    type: "Прототип R&D",
    names: [
      "«BioSensor Alpha»", "«NanoMaterial Beta»", "«QuantumChip Gamma»", "«FusionReactor Delta»",
      "«HoloDisplay Epsilon»", "«NeuralInterface Zeta»", "«ExoSkeleton Eta»", "«DroneSwarm Theta»",
      "«AutonomousVehicle Iota»", "«SmartFabric Kappa»", "«FlexibleBattery Lambda»", "«WirelessCharger Mu»",
      "«SolarCell Nu»", "«WindTurbine Xi»", "«WaveGenerator Omicron»", "«GeoThermalTap Pi»",
      "«HydrogenCell Rho»", "«CarbonCapture Sigma»", "«WaterPurifier Tau»", "«AirFilter Upsilon»",
      "«FoodPrinter Phi»", "«MedicalImplant Chi»", "«ProstheticLimb Psi»", "«HearingAid Omega»",
      "«SmartGlasses Alpha2»", "«ARHeadset Beta2»", "«VRController Gamma2»", "«HapticGlove Delta2»",
      "«MotionCapture Epsilon2»", "«FacialTracker Zeta2»", "«EyeTracker Eta2»", "«BrainInterface Theta2»",
      "«MuscleStimulator Iota2»", "«SleepMonitor Kappa2»", "«StressDetector Lambda2»", "«MoodTracker Mu2»",
      "«HealthBand Nu2»", "«SmartPill Xi2»", "«MicroRobot Omicron2»", "«NanoBot Pi2»",
      "«CellRepair Rho2»", "«GeneEditor Sigma2»"
    ],
    descriptions: [
      "Экспериментальная разработка на стадии лабораторных испытаний с документированными результатами тестирования.",
      "Прототип устройства с подтверждённой концепцией и готовностью к следующему этапу разработки.",
      "R&D-проект с техническим обоснованием и дорожной картой коммерциализации.",
      "Исследовательская разработка с потенциалом патентования и выхода на серийное производство.",
      "Инновационный прототип с проведёнными испытаниями и анализом рыночного потенциала.",
    ]
  },
};

const padNumber = (num: number): string => {
  return num.toString().padStart(3, "0");
};

const generateDemoListings = (): DemoListing[] => {
  const listings: DemoListing[] = [];
  const categorySlugs = Object.keys(categoryData);
  const itemsPerCategory = Math.floor(500 / 12);
  const remainder = 500 % 12;
  
  let globalId = 1;
  
  categorySlugs.forEach((categorySlug, categoryIndex) => {
    const category = categoryData[categorySlug];
    const itemCount = itemsPerCategory + (categoryIndex < remainder ? 1 : 0);
    
    for (let i = 0; i < itemCount; i++) {
      const nameIndex = i % category.names.length;
      const descIndex = i % category.descriptions.length;
      const name = category.names[nameIndex];
      const baseDescription = category.descriptions[descIndex];
      
      listings.push({
        id: `demo-${globalId}`,
        category: categorySlug,
        name: `${category.type} ${name}`,
        description: baseDescription,
        registration_number: `DEMO-${padNumber(globalId)}`,
        price: null,
        price_negotiable: true,
        status: "demo",
        views_count: Math.floor(Math.random() * 200) + 50,
        favorites_count: 0,
        cart_count: 0,
        is_demo: true,
        demo_label: "Ознакомительный · недоступна для сделки",
        legal_status: "Демо-карточка: сделки по объекту не совершаются",
        can_buy: false,
        created_at: new Date(Date.now() - globalId * 60000).toISOString(),
        user_id: "demo-user",
      });
      
      globalId++;
    }
  });
  
  return listings;
};

export const demoListings = generateDemoListings();

export const getDemoListingsByCategory = (categorySlug: string): DemoListing[] => {
  if (categorySlug === "all") return demoListings;
  return demoListings.filter(item => item.category === categorySlug);
};

export const getDemoListingById = (id: string): DemoListing | undefined => {
  return demoListings.find(item => item.id === id);
};

export const getDemoCategoryCount = (categorySlug: string): number => {
  return demoListings.filter(item => item.category === categorySlug).length;
};
