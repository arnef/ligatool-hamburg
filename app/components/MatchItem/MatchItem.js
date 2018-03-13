// import React from 'react';
// import { View } from 'react-native';
// import { connect } from 'react-redux';
// import moment from 'moment';
// import { Card, Text, Icon, TeamLogo, Score } from '../../components';
// import { DATETIME_FORMAT } from '../../config/settings';
// import Routes from '../../config/routes';
// import * as NavigationActions from '../../redux/modules/navigation';
// import styles from './styles';
// import { getColor } from '../../redux/modules/user';

// function MatchItem(props) {
//   if (!props.data) {
//     return <View />;
//   }
//   const date = moment(props.data.date, 'YYYY-MM-DD HH:mm:ss');
//   return (
//     <Card
//       onPress={() => {
//         props.dispatch(
//           NavigationActions.navigate({
//             routeName: Routes.MATCH,
//             params: { id: props.data.id, title: props.data.competitionName },
//           }),
//         );
//       }}
//     >
//       <View style={styles.container}>
//         <Text bold color={props.color}>
//           {`${props.data.competitionName} (${props.data.matchday})`}
//         </Text>

//         <Text secondary small>
//           {props.data.venue && <Icon name={'pin'} />}
//           {props.data.venue ? ` ${props.data.venueName}  ` : ''}
//           <Icon name={'clock'} />{' '}
//           {`${props.data.status === 'POSTPONED' ? 'bisher ' : ''}${date.format(
//             DATETIME_FORMAT,
//           )}`}
//         </Text>
//         <View style={styles.teams}>
//           <View style={styles.team}>
//             <TeamLogo team={props.data.homeTeamLogo} big />
//             <View style={styles.teamName}>
//               <Text small center numberOfLines={2}>
//                 {props.data.homeTeamName}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.score}>
//             <Score setPoints={props.data} />
//           </View>
//           <View style={styles.team}>
//             <TeamLogo team={props.data.awayTeamLogo} big />
//             <View style={styles.teamName}>
//               <Text small center numberOfLines={2}>
//                 {props.data.awayTeamName}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </Card>
//   );
// }

// export default connect(state => ({ color: getColor(state) }))(MatchItem);
