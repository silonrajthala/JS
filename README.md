# JS
.php
function getSideSubMenu($parentId, $level = 1) {
  $submenulist = DB::select(DB::raw("
    select m.id, m.modulename, m.url, m.icon
    from modules m
    join module_permission mp on m.id=mp.modulesid
    where m.parentmoduleid = ? and
          mp.usertypeid = ?
    group by m.id, m.modulename, m.url, m.icon
    order by m.orderby
  "), [$parentId, $userdata->usertype]);

  $html = '';
  foreach ($submenulist as $subli) {
    $submenu = getSideSubMenu($subli->id, $level + 1); // Recursive call with level tracking
    $html .= '<li class="sidebar-item">';
    $html .= '<a class="sidebar-link" href="' . url('/admin/' . $subli->url) . '">' . $subli->modulename . '</a>';
    if ($submenu && $level < 3) { // Check level and existence of submenu
      $html .= '<ul class="sidebar-dropdown list-unstyled">';
      $html .= $submenu;
      $html .= '</ul>';
    }
    $html .= '</li>';
  }
  return $html;
}

.blade.php page

<ul class="sidebar-nav">
    <li class="sidebar-header">Pages</li>

    @php
        $menulist = getSideMenu();
        $path = Request::path();
    @endphp

    @foreach($menulist as $li)
        @php
            $submenulist = getSideSubMenu($li->id);
        @endphp

        @if(count($submenulist) > 0)
            @php
                $isactive = '';
                $collapsed = 'collapsed';
                $ariaexpanded = 'false';
                $iscollapse = 'collapse';

                if ($path == 'admin/' . $li->url || 
                   // Check path for active state in sub-submenus
                   strpos($path, 'admin/' . $li->url . '/') !== false) {
                    $isactive = 'active';
                    $collapsed = '';
                    $ariaexpanded = 'true';
                    $iscollapse = '';
                }
            @endphp

            <li class="sidebar-item {{$isactive}}">
                <a data-bs-toggle="collapse" href="#{{ preg_replace('/\s/', '', $li->modulename) }}" class="sidebar-link {{$collapsed}}" aria-expanded="{{$ariaexpanded}}">
                    <i class="align-middle {{$li->icon}}" data-feather="layout"></i> <span class="align-middle">{{$li->modulename}}</span>
                </a>

                <ul id="{{ preg_replace('/\s/', '', $li->modulename) }}" class="sidebar-dropdown list-unstyled {{$iscollapse}}" data-bs-parent="#sidebar">
                    @foreach($submenulist as $subli)
                        @php
                            $subsubmenulist = getSideSubMenu($subli->id); // Additional call for sub-submenus
                        @endphp

                        <li class="sidebar-item @if($path == 'admin/' . $subli->url) active @endif">
                            <a class="sidebar-link" href="{{ url('/admin/' . $subli->url) }}">{{ $subli->modulename }}</a>

                            @if(count($subsubmenulist) > 0)
                                <ul class="sidebar-dropdown list-unstyled nested-submenu">
                                    @foreach($subsubmenulist as $subsubli)
                                        <li class="sidebar-item @if(strpos($path, 'admin/' . $subsubli->url . '/') !== false) active @endif">
                                            <a class="sidebar-link" href="{{ url('/admin/' . $subsubli->url) }}">{{ $subsubli->modulename }}</a>
                                        </li>
                                    @endforeach
                                </ul>
                            @endif
                        </li>
                    @endforeach
                </ul>
            </li>
        @else
            <li class="sidebar-item @if($path == 'admin/' . $li->url) active @endif">
                <a class="sidebar-link" href="{{ url('/admin/' . $li->url) }}">
                    <i class="align-middle {{$li->icon}}" ></i> <span class="align-middle">{{$li->modulename}}</span>
                </a>
            </li>
        @endif
    @endforeach
</ul>



next possible code

function getSideMenu()
{
    $userdata = getUserDetail();

    // Fetch all modules with permission check
    $menu = DB::select(DB::raw("
        select m.id, m.modulename, m.url, m.icon, m.parentmoduleid
        from modules m
        join module_permission mp on m.id=mp.modulesid
        where mp.usertypeid = ?
        order by m.orderby
    "), [$userdata->usertype]);

    // Build hierarchical menu using recursion
    $menuList = [];
    foreach ($menu as $item) {
        $menuItem = [
            'id' => $item->id,
            'modulename' => $item->modulename,
            'url' => $item->url,
            'icon' => $item->icon,
            'submenus' => [],
        ];

        // Recursive call for child menus
        if ($item->parentmoduleid > 0) {
            $menuItem['submenus'] = getNestedMenus($item->parentmoduleid, $menu);
        }

        $menuList[] = $menuItem;
    }

    return $menuList;
}

// Helper function for nested menu retrieval
function getNestedMenus($parentId, $menu)
{
    $submenus = [];
    foreach ($menu as $item) {
        if ($item->parentmoduleid == $parentId) {
            $menuItem = [
                'id' => $item->id,
                'modulename' => $item->modulename,
                'url' => $item->url,
                'icon' => $item->icon,
                'submenus' => [],
            ];

            // Recursive call for further nested levels
            if (count(array_filter($menu, function ($innerItem) use ($item) {
                return $innerItem->parentmoduleid == $item->id;
            })) > 0) {
                $menuItem['submenus'] = getNestedMenus($item->id, $menu);
            }

            $submenus[] = $menuItem;
        }
    }
    return $submenus;
}


project
AN ENGINEERING PROJECT REPORT
On
COLLEGE INFORMATION MANAGEMENT SYSTEM
Submitted By
	Saman Neupane	180328
	Sanoj Shrestha	180329
	Silon Rajthala	180332
Submitted To
The Department of Information and Communications Technology in partial fulfillment of the requirement for the degree of Bachelor of
Engineering in computer
 
Cosmos College of Management & Technology
(Affiliated to Pokhara University)
Tutepani, Lalitpur, Nepal
28th, June, 2023
Contents
1 Background	1
1.1 Introduction	1
1.2 Rationale	2
1.3 Objectives	2
1.4 Scope	2
1.5 Limitation	2
1.6 Problem Definition	3
1.7 Statement of Problem	3
2 Literature review	4
3 Requirement Analysis	5
3.1 Feasibility Study	5
3.1.1 Financial Feasibility	5
3.1.2 Technical Feasibility	5
3.1.3 Behavioral Feasibility	6
3.1.4 Operational Feasibility	6
3.2 Requirement Specification	6
3.2.1 Functional Requirement	6
3.2.2 Non-Functional Requirement	7
3.3 Hardware and Software Requirement	8
4 Project Methodology	9
4.1 Software Process Model	9
4.1.1 Iterative Model	9
4.2 Flow Chart	11
4.3 Class Diagram	13
4.4 Work Breakdown Structure	14
4.5 Tools and Environment	15
4.5.1 Tools	15
4.5.2 Environment	15
5 Expected Output	16
6 Work Progress	17
6.1 Task Completed	17
6.2 Task Remaining	17
7 Working Schedule	18
References	20
Appendix	22


List of Tables
	3.1	Hardware Requirement . . . . . . . . . . . . . . . . . . . . . . . . . .	8
	3.2	Software Requirement	. . . . . . . . . . . . . . . . . . . . . . . . . .	8
	7.1	Working Schedule . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	18 
List of Figures
4.1	Iterative model	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	10
4.2	Flow Chart for Mobile	. . . . . . . . . . . . . . . . . . . . . . . . . .	11
4.3	Flow Chart for Desktop . . . . . . . . . . . . . . . . . . . . . . . . . .	12
4.4	Class Diagram . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	13
4.5	Work Breakdown Structure . . . . . . . . . . . . . . . . . . . . . . . .	14
7.1	Gantt chart for project tasks . . . . . . . . . . . . . . . . . . . . . . . .	19
2	Home	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	22
3	Profile . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	23
4	Attendance	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	24
5	Admin Dashboard . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	25
6	Class View	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	25
Abstract
This project aims to create a Web application designed to streamline the management of students’ and teachers’ activities within college environments. The app will provide features for updating attendance records, maintaining student and faculty department information, and granting administrators or Heads of Departments (HODs) access to attendance and grading details. Comprehensive information regarding faculty and students will be readily accessible to administrators. Moreover, the app will generate and maintain summary reports to enable students to conveniently view their attendance records, grading details, and overall performance metrics. By leveraging mobile technology, this app seeks to enhance the efficiency and effectiveness of information management in college settings.
 
Chapter 1
Background
1.1	Introduction
Nowadays education is playing a significant role in society. Day by day, the literacy rate is increasing. Education will change society in all aspects and everyone wants to study for higher professional degrees.
The College Information Management System (CIMS) is a state-of-the-art software application designed to meet the comprehensive needs and requirements of departmentlevel operations in the field of education. This integrated system streamlines daily activities,feedbackprocesses,andattendancemanagementwithinthecollege. Developed as a mobile application, CIMS facilitates efficient event organization, provides eventspecific feedback, and showcases departmental achievements. With a secure login system using unique user credentials, students can interact with the system through their mobile devices. The system begins with an online registration form where students provide their information, which is then compared with the database records. Upon successful validation, students receive a username and password, granting them access to attendance records, grades, and other academic details. In case of any discrepancies, theentryisflaggedandcanceledtoensuredataintegrity.CIMSincludesanadministrative level that offers additional functionality to manage the department’s overall operations. By leveraging the capabilities of mobile technology, the system operates efficiently and at high speed. It encompasses essential modules for effective department management, ensuring a seamless experience for all stakeholders. This software application serves as a centralized repository for student attendance records, marks, and other academic information. By providing students and teachers with easy access to their respective details, CIMS significantly saves time and resources. Furthermore, the system enables the creation of events and allows for student feedback, enhancing the department’s engagement with its stakeholders. To ensure data validation and efficient processing of user input, the Dart programming language will be utilized. The system architecture incorporates a database layer that acts as a middle layer, facilitating communication between the application layers and the Firebase database.
1.2	Rationale
A college information management system helps to get information and details of the academic data of students and also helps to keep a record of data for a longer period.
•	This will help in the systematic management of information for many students.
•	It will make communication between students and teachers easier.
•	Distribution of notes, lecture routines, and providing notices are faster and easier.
1.3	Objectives
The objectives of the College Information Management System (CIMS) project are as follows:
•	To develop a web application for college.
•	To increase the good organization of college documentation organization.
1.4	Scope
The scope of the College Information Management System (CIMS) project encompasses the following:
•	College with hundreds of students in a single class.
•	Note sharing and notices sharing need to be faster.
•	Attendance needs to be efficient.
1.5	Limitation
Some limitations of our project are listed below as follows:
•	Requires college database for full functionality.
•	Web application must be online to access all features.
1.6	Problem Definition
The problem at hand is to develop an information system that effectively addresses the need for comprehensive and accessible college information. The system should cater to the requirements of college staff members, students, and parents, facilitating their understanding and engagement with the institution. Key objectives include providing an interactive platform that allows users to easily retrieve vital information such as student attendance, remarks, exam performance, grades, and notices. Ensuring seamless access and efficient utilization of these features is critical for enhancing communication and transparency within the college community.
1.7	Statement of Problem
Manual systems are prone to errors, and require a lot of time and manpower. As the number of data increases this problem will increase accordingly.
•	Handwritten attendance in every lecture session is time-consuming and inefficient.
•	Communication with lectures and professor are harder. 
Chapter 2
Literature review
To add mobility and automation to the process of managing student information in an institute. Mostly, the notices, schedules, and attendances are done either by using hard copy (printed) or a handwritten system [10]. Using faster and easier forms of communication among the students is mobile technology just like WhatsApp. As WhatsAppismainlyusedforcommunicatingwithstudents, creatingasocialatmosphere, encouraging sharing among students, and also as a learning platform [7]. The motive behindcreatingthismobileapplicationissecurity,encryption,andaccessibility. ApplicationSandboxing,Memoryrandomization,Encryption,DataStorage,andBuilt-inAntivirus are security requirements for Mobile Operating systems [5]. Almost all undergraduate studentshaveaccesstoamobiledevice[12]. Theeducationsystemisbecomingadvanced duetotherapidgrowthoftechnology. Afterthepandemic, Remoteteaching-learninghas become more practical and applicable. This is the right time for implementing a Mobilebased College Management System for the advancement of institutions and the education system. Flutter is a unique cross-platform framework that is used for developing highperformance mobile applications which were publicly released in 2016 by Google [11]. Smart attendance systems were introduced before. For example, attendance, using a QR code scan for attendance, etc. However, these systems have some shortage of use [8]. In this system, a student with a Wi-Fi connection will automatically be presented in an attendance sheet[8].
Web-based application for college management system is to enhance the management of studentinformationinaninstitutebyintroducingmobilityandautomation. Theproposed solution is an Android-based mobile application that will be used by students, teachers, and parents. The application aims to replace traditional forms of communication, such as notices and handwritten manuals, with faster and more efficient methods using cell phone technology[9].
Chapter 3
Requirement Analysis
3.1	Feasibility Study
The purpose of the feasibility study is to determine whether the problem can be solved with minimum cost as soon as possible. The feasibility study is based on the following questions:
•	Is the user eligible to use the system?
•	Does the system impact the organization?
3.1.1	Financial Feasibility
The project involves evaluating the financial support required to obtain a dedicated server for hosting the product during the development phase. This assessment includes considering the costs of purchasing or leasing the server, as well as associated expenses like installation, configuration, and maintenance. Having a dedicated server is crucial for seamless testing, staging, and deployment of the product, providing the necessary computing resources, storage capacity, and network connectivity. By analyzing factors such as server specifications, scalability options, and additional required services or features, we can estimate the upfront costs of acquiring and setting up the server. This evaluation helps determine if the necessary financial resources are available and if investing in the server aligns with the project’s budget and objectives.
3.1.2	Technical Feasibility
For a college information management system involves determining if the project is technically possible. This includes assessing if the required expertise, infrastructure, and devices are available. It also involves evaluating compatibility and identifying any potential technical risks or challenges.
3.1.3	Behavioral Feasibility
For a college information management system involves assessing if the users are willing and able to adapt to the system. This includes evaluating user acceptance, training and support, organizational culture, user interface, and stakeholder engagement. The analysis helps determine if users are likely to embrace the system and if any challenges need to be addressed to ensure successful implementation and usage.
3.1.4	Operational Feasibility
For a college information management system evaluates if it can be implemented smoothly within the college’s operations. This includes assessing resource availability, technicalcompatibility,processadaptation,scalability,riskassessment,andtraining/change management. The analysis determines if the college has the required resources and capabilitiestoeffectivelyimplementandoperatethesystem,ensuringseamlessintegration and efficient management processes.
3.2	Requirement Specification
•	To register new students.
•	To record the attendance of students.
•	To record the internal marks of students. • To register staff and teachers/employees.
•	To register a new user for the system.
•	To record the course details and faculties information.
•	To provide the routine of classes to students.
•	To provide event details of extracurricular activities (ECA).
3.2.1	Functional Requirement
•	Admin will create details of student and teacher with personal information.
•	Store records obtained marks, performance, and attendance details of students.
•	Display the required information of students and faculties.
3.2.2	Non-Functional Requirement
•	Price: cost will be less (compared to other commercial products).
•	Usability: It should be friendly to the user and the user interface (UI) should be easy to understand and use.
•	Performance: It should be tested and maintained from time to time.
•	Reliability:	The system must be reliable so that it brings up the concept of modularity.
•	Re-usability: The system must be dynamic so that it can be updated, upgraded, and can be used for years following. 
3.3	Hardware and Software Requirement
Android/IOS Version	7
RAM	1GB
Storage	500MB
Processor	Any
Table 3.1: Hardware Requirement
VS Code
MySQL
Flutter SDK
Table 3.2: Software Requirement 
Chapter 4
Project Methodology
4.1	Software Process Model
4.1.1	Iterative Model
The Agile model recognizes the importance of adapting project management approaches to suit the unique requirements of each project. It emphasizes the division of tasks into time boxes, or small time frames, to enable the delivery of specific features within a release.
Agile methodology embraces an iterative approach, whereby a functioning software buildisdeliveredaftereachiteration. Thesebuildsareincrementalinnature,progressively incorporatingthefeaturesrequestedbythecustomer. Ultimately,thefinalbuildencompasses all the necessary features as specified by the customer. [4]
•	Planning: Duringthisinitialphase,theprojectteamengagesinthoroughdiscussions withthecustomertoascertaintheproject’sobjectivesandrequirements. Subsequently, they create a meticulously crafted project plan and develop a prioritized list of features, commonly referred to as a product backlog.
•	Requirements Analysis: In this phase, the team collaborates closely with the customer to break down the features outlined in the product backlog into smaller, more manageable units called user stories. These user stories serve as the foundation for defining the requirements for each iteration or development cycle. • Design: Thedesignphaseentailsthecreationofacomprehensivehigh-leveldesign that delineates the system’s architecture and identifies the essential components and interfaces.
•	Implementation: Theimplementationphaseinvolvestheactualdevelopmentofthe software product, executed in short iterations or sprints. The team incrementally constructs and refines the product, steadily incorporating new functionality. • Testing: Comprehensive testing is conducted during this phase to detect and rectify any defects or issues that arise during the development process. Testing and feedback mechanisms are employed to ensure a reliable software product. • Deployment: Upon successful development and thorough testing, the software is ready for deployment in the production environment.
 
Figure 4.1: Iterative model
Figure referenced from [4]
4.2	Flow Chart
 
Figure 4.2: Flow Chart for Mobile
The diagram presented illustrates the internal functioning of our college management project. To commence, in the absence of pre-registered students and teachers in the system, the process initiates from the login page, which subsequently redirects users to the signup page. Upon successful verification, users are directed to their respective personalized home pages, which exhibit similarities while possessing distinct characteristics. As part of the verification process, users are furnished with unique email addresses and passwords, facilitating their login procedure.
Within the home page, users gain access to a range of dedicated features, including attendance tracking, notes, notices, personal profiles, schedules, academic results, and numerous other functionalities.
 
Figure 4.3: Flow Chart for Desktop
4.3	Class Diagram
 
Figure 4.4: Class Diagram
4.4	Work Breakdown Structure
 
Figure 4.5: Work Breakdown Structure
4.5	Tools and Environment
4.5.1	Tools
•	Flutter(Dart Language)
Flutter is Google’s portable user interface structure for making top-notch local interfaces on Android and iOS at a specific time. Flutter applications are achieved in the Dart coding language and embedded in local code, so the exhibition is astonishing.[6].
•	MySQL
MySQL is an open-source relational database management system (RDBMS). Its name is a combination of ”My”, the name of co-founder Michael Widenius’s daughter My, and ”SQL”, the acronym for Structured Query Language. A relational database organizes data into one or more data tables in which data may be related; these relations help structure the data. SQL is a language programmers use to create, modify and extract data from the relational database, as well as control user access to the database. In addition to relational databases and SQL, an RDBMS like MySQL works with an operating system to implement a relational database in a computer’s storage system, manages users, allows for network access, and facilitates testing database integrity and creation of backups.[2].
4.5.2	Environment
•	Visual Studio Code
Visual Studio Code is a lightweight but powerful source code editor which runs on desktops and is available for Windows, macOS, and Linux. It comes with built-in support for JavaScript, TypeScript, and Node.js and has a rich ecosystem of extensions for other languages and runtimes [1].
•	MySQL Workbench
MySQL Workbench is a unified visual tool for database architects, developers, and DBAs. MySQL Workbench provides data modeling, SQL development, and comprehensive administration tools for server configuration, user administration, backup, and much more. MySQL Workbench is available on Windows, Linux, and Mac OS X.[3]
Chapter 5
Expected Output
A full reactive system that can communicate with students and teachers and provide analytic information of students within and outside the classroom. 
Chapter 6
Work Progress
6.1	Task Completed
•	UI Design.
•	Frontend
•	Database connection
6.2	Task Remaining
• Backend
Chapter 7
Working Schedule
Task	Duration(in days)
Requirement Collection	5
UI Design	10
Frontend	25
Backend	20
Inbtegration and Testing	5
Testing and Debugging	10
Deployment	5
Table 7.1: Working Schedule
 
Figure 7.1: Gantt chart for project tasks
References
[1]	Getting started with visual studio code. https://code.visualstudio.com/ docs. Accessed: 2022-05-20.
[2]	MySQL - Wikipedia — en.wikipedia.org. https://en.wikipedia.org/wiki/ MySQL. [Accessed 26-Jun-2023].
[3]	MySQL :: MySQL Workbench — mysql.com. https://www.mysql.com/ products/workbench/. [Accessed 26-Jun-2023].
[4]	SDLC - Agile Model — tutorialspoint.com. https://www.tutorialspoint. com/sdlc/sdlc_agile_model. [Accessed 08-May-2023].
[5]	Mohd Shahdi Ahmad, Nur Emyra Musa, Rathidevi Nadarajah, Rosilah Hassan, and Nor Effendy Othman. Comparison between android and ios operating system in terms of security. 2013 8th International Conference on Information Technology in Asia (CITA), pages 1–4, 2013.
[6]	Ghusoon Idan Arb and Kadhum Al-Majdi. A freights status management system based on dart and flutter programming language. Journal of Physics: Conference Series, 1530(1):012020, may 2020.
[7]	DanBouhnikandMorDeshen. Whatsappgoestoschool: Mobileinstantmessaging between teachers and students. Journal of Information Technology Education: Research, 13:217–231, 01 2014.
[8]	Mahadi Hasan, Dipto Saha, Jannatul Ferdosh, Fernaz Narin Nur, Nazmun Nessa Moon, and Mohd. Saifuzzaman. Bssid based monitoring class attendance system using wifi. In 2019 Third International conference on I-SMAC (IoT in Social, Mobile, Analytics and Cloud) (I-SMAC), pages 243–248, 2019.
[9]	AJKadam, AssistantProfessorDepartmentofComputerEngineeringA.I.S.S.M.S. College of Engineering Pune, Maharashtra,India, Aradhana Singh, Komal
Jagtap, Srujana Tankala, Student(UG)Department of Computer Engineering
A.I.S.S.M.S. College of Engineering Pune, Maharashtra,India, Student(UG)
Department of Computer Engineering A.I.S.S.M.S. College of Engineering Pune, Maharashtra,India, and Student(UG) Department of Computer Engineering A.I.S.S.M.S. College of Engineering Pune, Maharashtra,India. Mobile web based android application for college management sysytem. Int. J. Eng. Comput. Sci., February 2017.
[10]	Anilkumar Kadam, Aradhana Singh, Komal Jagtap, and Srujana Tankala. Mobile web based android application for college management sysytem. International Journal Of Engineering And Computer Science, 02 2017.
[11]	Marco L Napoli. Beginning flutter: a hands on guide to app development. John Wiley & Sons, 2019.
[12]	Krishna Parajuli. Mobile learning practice in higher education in nepal. Open Praxis, 8, 03 2016. 
Appendix
 
	(a) White Mode	(b) Dark Mode
Figure 2: Home
 
	(a) White Mode	(b) Dark Mode
Figure 3: Profile
 
	(a) White Mode	(b) Dark Mode
Figure 4: Attendance
 
Figure 5: Admin Dashboard
 
Figure 6: Class View
![image](https://github.com/silonrajthala/JS/assets/154122439/a9dba67d-a65b-4b3b-83f1-f22a0e8abad4)



<ul class="sidebar-nav">
    <li class="sidebar-header">
        Pages
    </li>
    
    @php
    $menuList = getSideMenu();
    $path = Request::path();
    @endphp

    @foreach($menuList as $menu)

        @php
        $subMenuList = getSideSubMenu($menu->id);
        @endphp

        <li class="sidebar-item">
            <a data-bs-toggle="collapse" href="#{{ preg_replace('/\s/', '', $menu->modulename) }}" class="sidebar-link">
                <i class="align-middle {{ $menu->icon }}" data-feather="layout"></i> <span class="align-middle">{{ $menu->modulename }}</span>
            </a>
            
            <ul id="{{ preg_replace('/\s/', '', $menu->modulename) }}" class="sidebar-dropdown list-unstyled collapse">
                @foreach($subMenuList as $subMenu)

                    @php
                    $subSubMenuList = getSideSubMenu($subMenu->id);
                    @endphp

                    <li class="sidebar-item">
                        <a data-bs-toggle="collapse" href="#{{ preg_replace('/\s/', '', $subMenu->modulename) }}" class="sidebar-link">
                            <i class="align-middle {{ $subMenu->icon }}" data-feather="layout"></i> <span class="align-middle">{{ $subMenu->modulename }}</span>
                        </a>

                        <ul id="{{ preg_replace('/\s/', '', $subMenu->modulename) }}" class="sidebar-dropdown list-unstyled collapse">
                            @foreach($subSubMenuList as $subSubMenu)
                                <li class="sidebar-item">
                                    <a href="{{ url('/admin/' . $subSubMenu->url) }}" class="sidebar-link">
                                        <i class="align-middle {{ $subSubMenu->icon }}"></i> <span class="align-middle">{{ $subSubMenu->modulename }}</span>
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    </li>
                @endforeach
            </ul>
        </li>
    @endforeach
</ul>
