from datetime import timedelta

from airflow.utils.dates import days_ago
from airflow import DAG
from airflow.operators.bash_operator import BashOperator

default_args = {
  'owner': 'Yilin',
  'start_date': days_ago(0),
  'depends_on_past': False,
  'retries': 1,
  'retry_delay': timedelta(minutes=1)
}

dag = DAG(
  'shipment_dag',
  default_args=default_args,
  description='DAG for the shipment system',
  schedule_interval=timedelta(minutes=1)
)

t1 = BashOperator(
  task_id='state_sync',
  bash_command='curl http://web:8000/state-sync',
  dag=dag
)