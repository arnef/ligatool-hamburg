import React, { Component, PropTypes} from 'react';
import { View,	Text, StyleSheet, Platform } from 'react-native';


class Score extends Component {

	renderScore() {
		const match = this.props.setPoints;
		
		return match.set_points ? `${match.set_points_home}:${match.set_points_away}` : '-:-';
	}

	render() {
		if (this.props.setPoints) {
			return (
				<View style={styles.score}>
					<Text style={styles.scoreText}>
						{ this.renderScore() }
					</Text>	
				</View>
			);
		}
		else if (this.props.goals) {
			const set = this.props.goals;
			return (
				<View style={{borderWidth: 0}}>
				<View style={[styles.score, { width: 48}, this.props.style]}>
					<Text style={styles.scoreText}>
						{ ( set.goals_home != null ? set.goals_home : '-') + ':' + ( set.goals_away != null ? set.goals_away : '-') }
					</Text>
				</View>
				</View>
			);
		}
		else {
			return (
				<View style={[styles.score, { width: 48}, this.props.style]}>
					<Text style={styles.scoreText}>
						-:-
					</Text>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	score: {
        width: 56,
        marginHorizontal: 4,
        padding: 6,
        borderRadius: 2,
        backgroundColor: '#555'
    },
    scoreText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: Platform.select({
            android: 'monospace',
            ios: 'Courier New'
        }),
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

Score.propTypes = {
	setPoints: PropTypes.object,
	goals: PropTypes.object
};


export default Score;
