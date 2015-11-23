<?php
	
	$holder = array();

	if( isset( $_APIVALS['url'] ) ){	
		$db = MongoConnection();
		$db_getter = new MongoGetter( $db );
		$url = $_APIVALS['url'];
		//$start_date = new DateTime( $json['start_date'] );
		//$end_date = new DateTime( $json['end_date'] );
		//$start = $start_date->format( DateTime::ISO8601 );
		//$end = $end_date->format( DateTime::ISO8601 );
		$start = ( isset($json['start_date']) )? strtotime( $json['start_date'] ) : strtotime( date( "m/d/Y", strtotime("-1 week") ) );
		$end = ( isset( $json['end_date'] ) )? strtotime( $json['end_date'] ) : strtotime( date( "m/d/Y") );
		$data = $db_getter->getPageCountsByUrlAndDateRange( $url, $start, $end );
		
		foreach( $data as $row ){
			$tmp = array();
			$sec = $row["date"]->sec;
			$dt = new DateTime("@$sec");	
			$tmp['date'] = $dt->format('m/d/Y');
			$tmp['views'] = $row['views'];
			$tmp['unique'] = count( $row["ips"] );
			array_push( $holder, $tmp ); 		
		}		
	}
	echo json_encode( $holder );
?>